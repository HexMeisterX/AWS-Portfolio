# Design a 3D E-Commerce Platform Architecture on AWS

![AWS Architecture Diagram](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYUAAAC3CAYAAAD... [Embedded Architecture Diagram Image])

*(Note: The complete image data from Lesego and Cikizwa's original project document is embedded above.)*

---

## 1. Architecture Overview & Diagram

### 1.1 Architecture Overview

*(Contributed by Lesego & Cikizwa)*

The proposed 3D e-commerce platform uses **Amazon Route 53** for domain management and **Amazon CloudFront** for global content delivery. **Amazon S3** stores 3D product models and other static assets. **AWS WAF** provides web application protection. Traffic to the application is distributed by an **Elastic Load Balancer (ELB)** across **EC2** instances in two Availability Zones.

**Amazon RDS** provides the relational database with a Multi-AZ configuration for high availability, while **DynamoDB** provides NoSQL storage for product and customer-related data. **Amazon API Gateway** and **AWS Lambda** support API and event-driven processing, while **Amazon SQS** supports asynchronous order processing. **Amazon Cognito** and **IAM** provide identity and access management. **CloudWatch** provides monitoring and alarms, while **Trusted Advisor** helps with cost, performance, security, and other optimization considerations.

## 2. Requirements Summary Matrix

*(Contributed by Lesego & Cikizwa)*

| **Requirement** | **How your architecture addresses it** | 
| **High Availability** | EC2 instances and RDS are distributed across two Availability Zones. | 
| **Scalability** | Load balancing, EC2 across AZs, Lambda and DynamoDB support changing workloads. | 
| **Performance** | CloudFront delivers content globally, while S3 stores 3D assets close to the delivery layer. | 
| **Security** | WAF, Cognito, IAM, private subnets and Multi-AZ database architecture provide security controls. | 
| **Cost Optimization** | CloudFront, serverless Lambda, managed services, CloudWatch and Trusted Advisor help avoid unnecessary infrastructure and monitor usage. | 

## 3. Deep-Dive Architecture Breakdown

### 3.1 Security & High Availability

*(Contributed by Lesego)*

#### Security Architecture & Controls

Our platform implements a multi-layered, defense-in-depth security architecture to safeguard user data, protect core application logic, and secure high-value 3D assets stored in Amazon S3.

##### Edge Security & Threat Mitigation:

* **AWS WAF (Web Application Firewall):** Positioned at the edge to inspect incoming HTTP/HTTPS requests before reaching application servers. Custom rules block common web vulnerabilities, including SQL Injection (SQLi), Cross-Site Scripting (XSS), and automated bot traffic.

* **Amazon CloudFront Origin Access Control (OAC):** Direct public access to the S3 bucket housing 3D assets is restricted. Assets are only accessible via encrypted CloudFront edge locations using HTTPS.

##### Identity & Access Control:

* **AWS Cognito:** Handles secure customer registration, user authentication, and authorization. Supports Multi-Factor Authentication (MFA) and OAuth token-based authorization for frontend interaction with Amazon API Gateway.

* **AWS Identity and Access Management (IAM):** Adheres strictly to the Principle of Least Privilege. EC2 instances, AWS Lambda functions, and microservices use IAM roles and temporary credentials to interact with backend databases (DynamoDB and RDS) and SQS queues, eliminating hardcoded access keys.

##### Network Segmentation & Perimeter Security:

* **VPC Architecture:** Compute and database components are strictly segregated within a Virtual Private Cloud (VPC) across public and private subnets.

* **Private Subnets:** Amazon EC2 application servers and Amazon RDS databases are hosted exclusively inside private subnets without public IP addresses, shielding them from direct internet exposure.

* **Security Groups & Network ACLs:** Security groups act as stateful virtual firewalls. Incoming traffic to EC2 application instances is strictly limited to ports routed from the Network Load Balancer (NLB). RDS instances accept connections exclusively on port 3306/5432 from the EC2 private security group.

##### Data Protection & Encryption:

* **Encryption in Transit:** All communications—from user browser to CloudFront, API Gateway, and internal VPC network flows—are encrypted using TLS/HTTPS protocols.

* **Encryption at Rest:** Sensitive static assets in Amazon S3, application state in DynamoDB, order processing queues in SQS, and relational databases in Amazon RDS are encrypted at rest using AWS Key Management Service (KMS) managed keys.

#### High Availability & Failover Strategy

To maintain continuous 24/7 service availability and prevent single points of failure across the global 3D e-commerce platform, the design incorporates fault-tolerant AWS services and multi-zone redundancy.

##### DNS & Edge Redundancy:

* **Amazon Route 53:** Serves as the authoritative DNS service with built-in health checks. Route 53 automatically routes customer traffic to healthy edge locations and backend endpoints.

* **Amazon CloudFront:** Distributes 3D asset workloads globally across edge locations. If a primary edge cache location experiences degradation, Route 53 and CloudFront dynamically redirect requests to the nearest healthy point of presence.

##### Compute Tier High Availability & Auto Scaling:

* **Multi-AZ Infrastructure:** Amazon EC2 instances supporting core application logic are deployed across two distinct Availability Zones (AZ A and AZ B) within the AWS Region.

* **Traffic Load Balancing:** The Network Load Balancer (NLB) continuously monitors the health of EC2 instances across both public/private subnets and automatically redistributes application traffic away from unhealthy nodes.

* **Stateless Microservices:** API tasks and event processing are offloaded to serverless services like Amazon API Gateway, AWS Lambda, and Amazon SQS. Because Lambda functions and SQS run natively across multiple AZs within a region, event processing automatically scales and remains fault-tolerant without server maintenance.

##### Database Tier Failover & Resilience:

* **Amazon RDS Multi-AZ Deployment:** Primary database operations run in AZ A with a synchronous, stand-by replica running in AZ B.

* **Automated RDS Failover:** In the event of primary database failure, storage degradation, or network disruption in AZ A, Amazon RDS automatically performs a seamless failover to the standby replica in AZ B. Endpoint connections switch automatically without requiring manual DNS or application configuration changes.

* **DynamoDB Global Replication:** Customer and product catalog data stored in Amazon DynamoDB is automatically replicated across multiple physical facilities within the region, ensuring native high availability and single-digit millisecond latency.

##### Operational Monitoring & Self-Healing:

* **Amazon CloudWatch:** Monitors system health metrics (CPU usage, latency, error rates) in real time and triggers alarms if performance thresholds are breached.

* **AWS Trusted Advisor:** Provides automated security checks and architectural guidance to ensure high availability configurations and baseline security policies remain compliant.

### 3.2 Scalability, Performance & Cost Optimization

*(Contributed by Alneshia)*

#### 1. Scalability

Scalability is basically the system's ability to keep up when more people show up. For a 3D e-commerce platform, this is especially important because traffic doesn't follow a neat schedule. A product launch, a big sale, or even something going viral on social media can send user numbers through the roof within minutes. We chose to look at this as a layered problem — you need the network layer to scale, the compute layer to scale, and the database layer to scale all at the same time. If any one of those breaks down, the whole experience falls apart for the user.

After researching this, we found that the architecture handles scalability at every tier, which is why we think it's a strong design. Let us go through each service and explain what it does for scalability.

* **1.1 Elastic Load Balancer (ELB):** The Elastic Load Balancer is the first thing traffic hits when a user opens the platform. We think of it kind of like a traffic cop — its job is to make sure no single server gets slammed with too many requests at once. It spreads incoming traffic across multiple EC2 instances that are sitting in two different Availability Zones. The reason this matters is that if one zone has a problem, traffic just keeps flowing to the other one without the user noticing anything. What we found interesting when we were looking into ELB is that it actually scales itself automatically. You don't have to configure it to handle a spike — it just does. It can handle tens of millions of requests per second, which is way more than most platforms will ever need. It also does health checks on the EC2 instances behind it, so if one goes down or starts responding slowly, ELB stops sending it traffic. That's a really clean way to keep the system stable without anyone having to intervene manually.

* **1.2 EC2 Auto Scaling:** EC2 Auto Scaling is what makes the compute layer actually elastic. It works hand-in-hand with ELB — when Auto Scaling adds a new EC2 instance, it automatically registers it with the load balancer so traffic can start flowing to it right away. We think this is one of the most important services in the whole architecture because it's what prevents the platform from falling over during a traffic spike and also from wasting money during quiet periods. The way it works is you set up rules based on metrics. For example, you can say: "if average CPU usage across the fleet goes above 70%, add two more instances." CloudWatch watches those metrics and triggers the scaling actions. During a big product sale, new instances can be online within a few minutes. Then once the sale is over and traffic drops back down, Auto Scaling quietly terminates the extra instances so you're not paying for servers that aren't doing anything. That right-sizing behavior is really what makes cloud computing cost-effective in the first place.

* **1.3 AWS Lambda:** Lambda is the serverless piece of the architecture. We think it's a great fit for this platform because there's a whole category of tasks — like confirming an order, generating a thumbnail for a 3D model preview, or updating inventory after a purchase — that don't need a full server running 24/7. Lambda handles these kinds of short, event-driven jobs really well. What stands out to us about Lambda from a scalability perspective is that it literally scales from zero. If nobody is using the platform at 3 AM, Lambda isn't running and you're not paying for it. The moment a request comes in, Lambda spins up and handles it. And if a thousand requests come in at once, it handles all of them at the same time without any configuration needed. You can't over-provision Lambda because it doesn't have a fixed capacity limit the way a server does. For a startup that might see really uneven traffic patterns, that's a big deal.

* **1.4 Amazon API Gateway:** API Gateway is what connects the front-end shopping interface to all the back-end services. Every time a user searches for a product, adds something to their cart, or submits an order, that request goes through API Gateway first. We chose to explain it here because it's actually doing a lot of quiet scalability work that's easy to overlook. API Gateway is fully managed by AWS, which means it scales on its own to handle millions of concurrent API calls without the team having to do anything. It also has built-in throttling, so if someone (or a bot) tries to flood the API with requests, Gateway can rate-limit them before they ever reach Lambda or EC2. That's a nice layer of protection against traffic spikes caused by unexpected sources, not just legitimate users.

* **1.5 Amazon DynamoDB:** We honestly didn't know that much about DynamoDB before this project, but after looking into it we understand why it was chosen for this architecture. The biggest thing for scalability is that when it's set to on-demand mode, it scales read and write capacity automatically based on actual usage. You don't have to predict how much database traffic you'll have — it just handles it. For a platform that's storing product listings, user sessions, and shopping cart data, DynamoDB is a good fit because these operations happen constantly and they need to be fast. If the platform suddenly gets ten times the usual number of users browsing the catalog, DynamoDB scales up to handle all those reads without the team having to manually adjust anything. The reason this matters is that the database is often the bottleneck when everything else has been scaled out. DynamoDB removes that bottleneck.

* **1.6 Amazon SQS (Simple Queue Service):** SQS is something that we think is easy to underestimate but really important for handling traffic spikes gracefully. The basic idea is that instead of every incoming order request going straight to the back-end processing system, it gets placed in a queue first. The back-end workers then pull from that queue at whatever pace they can handle. Why does this help scalability? Because it decouples the front-end intake from the back-end processing. During a flash sale, the platform might receive thousands of orders in a few seconds. Without SQS, all of those would hit the back-end systems at once, and if those systems can't keep up, requests start failing. With SQS, the queue just holds everything safely and the back-end processes it as fast as it can. No requests get dropped, and you don't have to over-provision the back-end for the absolute worst-case spike. We think this is a really smart pattern and we're glad it was included in the architecture.

#### 2. Performance

Performance for this platform has two sides to it. The first is how fast the 3D content loads — the models, the textures, the interactive viewer. The second is how fast everything else responds — search results, cart updates, checkout. Both matter, but we'd argue the 3D content side is the harder problem because the file sizes are so much bigger than what a normal website serves. A GLTF model can be 20 or 30 MB, which is going to feel slow if it has to travel from a server in Virginia to a user in Australia every single time they load a product page.

After researching this, we found that the architecture has a really solid answer to both sides of the performance problem. Here's how each service contributes.

* **2.1 Amazon CloudFront:** CloudFront is honestly the most performance-critical service in the whole architecture as far as the 3D content experience goes. It's Amazon's content delivery network, and it has over 400 edge locations spread around the world. The way it works is that 3D model files, product images, and other static content get cached at edge locations. So when a user in Tokyo loads a product page, they're getting the 3D model from a server in Japan, not from the main application servers somewhere in the US. We think this is important because it cuts down the round-trip time dramatically. For big files like 3D models, that latency difference really shows up in how quickly the viewer loads. CloudFront also keeps connections open using persistent HTTP/2 connections, which speeds up how fast multiple assets load in parallel. Without CloudFront, the platform would probably feel sluggish to anyone not physically close to the main servers, and that's not acceptable for a global e-commerce platform.

* **2.2 Amazon S3:** S3 is where all the 3D model files, product images, and static content actually live before CloudFront caches them. We think people sometimes think of S3 as just a storage bucket, but it's actually designed for really high throughput. It handles parallel GET requests really well, which is important because a single product page might need to load multiple assets at once. What stood out to us about S3 in this context is that by storing assets there instead of on EC2 instances, the architecture frees up the compute servers to focus on dynamic processing. The EC2 instances don't have to worry about serving 50 MB 3D models — that's S3 and CloudFront's job. That separation of concerns helps both sides work better. S3 is great at high-volume file serving, and EC2 can focus on the application logic it's actually designed for.

* **2.3 API Gateway + AWS Lambda:** For all the dynamic, transactional parts of the shopping experience — product search, adding to cart, placing an order — API Gateway and Lambda work together to keep things fast. API Gateway routes each request to the right Lambda function, and Lambda executes it quickly in a managed environment. One thing we looked into that we think is worth mentioning is Lambda's Provisioned Concurrency feature. Normally, the first time a Lambda function gets called after sitting idle for a while, there's a "cold start" where it takes a few extra milliseconds to initialize. For a shopping platform where users expect instant responses, those extra milliseconds can add up to a noticeable slowdown. Provisioned Concurrency keeps function instances pre-warmed so they're always ready to respond immediately. It costs a bit more, but for the most time-sensitive functions like checkout, it's worth it.

* **2.4 Multi-Availability Zone Architecture (EC2 & RDS):** Member 1's design puts EC2 instances and RDS databases in two separate Availability Zones. We think most people think of multi-AZ as a high-availability feature — which it is — but it actually helps performance too. By having compute capacity in two zones, the load balancer can route each request to whatever instance responds fastest. That geographic distribution within the same region keeps intra-region latency low. For RDS specifically, the multi-AZ setup allows for read replicas. So instead of all database read queries going to the primary instance, they can be spread across replicas. For a product catalog with lots of browsing traffic, this makes a real difference. And if one AZ has a hiccup, traffic shifts to the healthy zone without users seeing a slowdown. We think this is a good example of how a design decision can serve two purposes at once — it's both more available and more performant.

* **2.5 Amazon DynamoDB (Performance):** DynamoDB shows up in both the scalability section and this one because it does both well. From a pure performance standpoint, the key thing is that it delivers single-digit millisecond response times. For something like checking product inventory in real-time or validating a session token during checkout, that speed matters a lot. After looking at this more, we found that AWS also offers DynamoDB Accelerator (DAX), which is an optional in-memory caching layer that can bring read latencies down to microseconds for data that gets accessed very frequently, like the top-selling products. Even without DAX, DynamoDB's base performance is really strong. For a NoSQL data store handling user sessions and shopping cart state, it's a good fit because the data model doesn't need the structure of a relational database, and the simpler key-value lookups translate to faster response times.

* **2.6 Amazon SQS (Performance):** We mentioned SQS under scalability, but it also helps performance in a specific way that we think is easy to miss. When a user places an order, there are a bunch of things that need to happen: send a confirmation email, update inventory, trigger fulfillment, maybe generate a receipt PDF. If the checkout API had to wait for all of those to finish before responding to the user, the checkout button would feel slow. SQS fixes this by letting the API respond to the user immediately with "order confirmed" and then queuing all the downstream tasks to happen in the background. The user doesn't have to sit there waiting for the email system and inventory system to finish. From their perspective, checkout is fast. The actual processing happens asynchronously, which is the right approach for anything that doesn't need to be done before the user gets their confirmation.

#### 3. Cost Optimization

This section is the one we found most interesting to think through, honestly. Cost optimization in the cloud isn't really just about spending less money — it's more about making sure you're not paying for capacity you don't need. For a startup especially, over-provisioning is a real problem. If you build for peak traffic all the time, you end up with a lot of idle servers running 24/7 that you're paying for even when nobody's using them.

We think what makes this architecture work well from a cost perspective is that most of the services are either serverless or auto-scaling, which means the spending naturally follows the usage. You don't have to figure out in advance what size your infrastructure needs to be. Let us go through each service and explain the cost angle.

* **3.1 AWS Lambda — No Idle Compute Costs:** Lambda is probably the best example of cloud cost efficiency in this architecture. You pay per invocation and per millisecond of execution time. When no one is using the platform, Lambda costs exactly zero. That's a huge deal for a startup that might be running the platform for months before it hits significant traffic. Compare that to running a fleet of EC2 instances 24/7 just in case someone submits an order — those instances are costing money even at 3 AM when traffic is basically nothing. For the types of tasks Lambda handles in this architecture — order processing, notifications, data transformations — they run briefly and only when needed. The pay-per-use model lines up perfectly with that usage pattern. We chose to highlight this first because we think it's the clearest example of how the architecture avoids waste.

* **3.2 Amazon CloudFront — Reducing Origin Server Load:** CloudFront helps performance, but it also saves money in a way that might not be immediately obvious. When a 3D model file is cached at a CloudFront edge location, the second user who requests that same file doesn't cause any load on the origin servers at all. The file is served straight from the edge. This means fewer requests hitting EC2 and S3, which means lower compute and bandwidth costs on the origin side. For a platform serving large 3D model files to a lot of users, a good cache hit rate can cut origin data transfer costs by a significant amount. CloudFront's pricing also gets cheaper per GB as volume increases, so as the platform grows, the unit cost of content delivery actually goes down. That's a nice economics curve for a growing startup.

* **3.3 EC2 Auto Scaling — Right-Sizing at All Times:** We already talked about Auto Scaling under scalability, but the cost angle is worth covering separately. The reason Auto Scaling matters for cost is that it eliminates the need to provision for worst-case traffic at all times. Without it, the team would have to keep enough EC2 instances running to handle the busiest possible day, even during quiet periods when most of that capacity sits idle. With Auto Scaling, the fleet shrinks during off-peak hours and grows when needed. For night-time hours, weekdays versus weekends, or just normal business cycles, this can translate to a big reduction in compute spending. The team can also mix in EC2 Spot Instances for background processing jobs like generating 3D model thumbnails, which can cut instance costs by up to 70-90% compared to On-Demand pricing for those workloads.

* **3.4 Amazon DynamoDB — On-Demand Pricing:** DynamoDB's on-demand capacity mode is a good fit for a startup because you don't have to commit to a specific amount of read and write capacity in advance. You just pay for what you use, per request. During early stages when traffic is unpredictable and relatively low, this avoids the cost of over-provisioning capacity that mostly sits unused. What's nice about DynamoDB is that as traffic grows and patterns become more predictable, the team can switch to provisioned capacity mode with auto-scaling, which is typically a bit cheaper at steady-state usage. That flexibility means the team can start cheap and optimize later without having to redo the architecture. We think that kind of adaptability is really valuable for a team that's still figuring out what their traffic looks like.

* **3.5 Amazon SQS — Avoiding Over-Provisioning the Back-End:** The cost benefit of SQS is closely related to the scalability benefit. Because SQS acts as a buffer between the front-end and the back-end, the back-end processing workers don't need to be sized for peak traffic. They can run at a steady, efficient pace and just work through the queue. Without this queue, the team would have to either over-provision the back-end for spikes or risk dropping requests during busy periods. SQS pricing is also really favorable at startup scale — the first million requests every month are free under AWS's Free Tier. After that, the per-request cost is very low. For a message-driven order processing system, the total SQS bill is going to be a small fraction of the overall infrastructure cost, but the architectural benefit is significant.

* **3.6 Amazon CloudWatch — Visibility Into What's Costing Money:** CloudWatch is the monitoring service that makes all the other cost optimization strategies actually work in practice. You can set up dashboards that show EC2 CPU utilization, Lambda invocation counts, DynamoDB consumed capacity, and API Gateway request rates all in one place. When something looks off — like an EC2 instance that's barely being used, or a Lambda function that's suddenly invoking way more than expected — CloudWatch surfaces that so the team can investigate. We think this is important because cost optimization isn't a one-time thing. Infrastructure usage changes over time as new features get added, traffic patterns shift, and the team makes updates. CloudWatch billing alarms let you set a threshold and get notified if estimated monthly costs go above it. That early warning system is really useful for catching something like an accidentally left-on development instance before it shows up as a surprise on the bill.

* **3.7 AWS Trusted Advisor — Automated Cost Recommendations:** Trusted Advisor is something we hadn't heard of before this project, and after looking into it we think it's genuinely underrated. It's basically an automated service that scans your AWS environment and flags things you might be wasting money on. Things like EC2 instances that have been running with very low CPU usage for weeks, load balancers that have no instances behind them, or storage volumes that aren't attached to anything anymore. For a small startup team that probably doesn't have a dedicated person watching cloud costs every day, Trusted Advisor serves as that automated second pair of eyes. It checks against AWS best practices across cost optimization, performance, security, and more. The higher-tier AWS support plans unlock more checks, but even the basic ones cover the most common cost issues. We think including this in the architecture shows a maturity in the design — it's not just built to work at launch, it's built to stay efficient over time.

### 3.3 Documentation, Design Trade-Offs & Architectural Challenges

*(Contributed by Reece)*

When designing a cloud architecture for a high-performance 3D e-commerce platform, balancing technical excellence with real-world startup constraints (such as budget, engineering overhead, and complexity) requires intentional trade-offs. Below are the key architectural decisions, challenges, and trade-offs evaluated for this system.

#### 1. Relational vs. NoSQL Dual-Database Strategy

* **Trade-Off:** The decision to use both **Amazon RDS** (Relational) and **Amazon DynamoDB** (NoSQL) adds operational complexity.

* **Why it was made:** Structured transactional data (such as financial orders, user accounts, and inventory integrity) benefits from the strict ACID compliance of Amazon RDS. On the other hand, unstructured metadata, catalog information, and session state demand single-digit millisecond response times at massive scale, where DynamoDB excels.

* **Challenge:** The engineering team must maintain two distinct database interfaces and handle data sync operations where appropriate. However, this separation guarantees that database scaling bottlenecks are avoided.

#### 2. Serverless (Lambda) vs. Provisioned Compute (EC2) Hybrid Model

* **Trade-Off:** Using a hybrid model rather than going 100% serverless or 100% containerized/EC2.

* **Why it was made:** Running long-lived core web applications on EC2 instances inside a VPC allows predictable baseline compute performance. Utilizing AWS Lambda for event-driven tasks (such as processing 3D models upon upload or executing order confirmations) prevents paying for idle EC2 compute capacity.

* **Challenge:** Lambda functions can experience "cold start" latencies when initialized after periods of inactivity. To mitigate this for customer-facing APIs, Provisioned Concurrency can be enabled for critical endpoints, slightly increasing baseline costs in exchange for minimal latency.

#### 3. Edge Caching vs. Asset Dynamic Updates

* **Trade-Off:** Aggressive edge caching of large 3D models via Amazon CloudFront vs. immediate model availability after updates.

* **Why it was made:** Serving 20–30 MB 3D asset files directly from origin S3 buckets globally would lead to exorbitant bandwidth costs and slow load times. Caching at CloudFront edge locations drastically lowers latency and origin server load.

* **Challenge:** When a 3D asset is updated or modified by an administrator, cached versions persist globally until the TTL (Time-To-Live) expires or explicit cache invalidations are issued. Object versioning (e.g., `model_v2.gltf`) is implemented as a standard practice to bypass invalidation fees and latency.

#### 4. Multi-AZ synchronous Database Replication Latency

* **Trade-Off:** Data consistency and zero-data-loss failover vs. slight write latency.

* **Why it was made:** High Availability (HA) requires Amazon RDS Multi-AZ synchronous replication across Availability Zones. Synchronous writes ensure that if AZ A fails, AZ B has an exact, uncorrupted replica.

* **Challenge:** Synchronous replication adds a slight millisecond latency overhead on write operations compared to a single-AZ database setup. This minor performance trade-off is necessary to meet our strict 24/7 uptime requirement.

## 4. Final Integration Synthesis

*(Contributed by Reece)*

The proposed 3D E-Commerce AWS Architecture provides a balanced, production-ready solution that satisfies all initial project requirements:

1. **High Availability:** Fully realized through multi-AZ EC2, multi-AZ RDS, Route 53 health checking, and regional serverless integrations.

2. **Scalability:** Managed horizontally across network tiers (ELB/API Gateway), compute tiers (EC2 Auto Scaling/Lambda), and data stores (DynamoDB/SQS).

3. **Performance:** Optimized for asset-heavy 3D file delivery via CloudFront edge locations and S3 throughput, backed by low-latency serverless and NoSQL operations.

4. **Security:** Built around defense-in-depth principles incorporating AWS WAF, IAM least privilege policies, Cognito authentication, private subnet isolation, and end-to-end KMS encryption.

5. **Cost Optimization:** Controlled through serverless pay-per-use primitives, auto-scaling compute pools, origin offloading, CloudWatch monitoring, and automated optimization via Trusted Advisor.

### Project Sign-off & Team Credits

This completed architecture project and final integrated documentation was created and reviewed by:

* **Lesego** — *Architecture Design, Visual Diagramming, Security & High Availability*

* **Cikizwa** — *Architecture Overview, Requirements Traceability & High Availability Matrix*

* **Alneshia** — *Scalability, Performance Analysis & Cost Optimization Strategy*

* **Reece** — *Documentation Integration, Trade-Offs & Final Project Synthesis*