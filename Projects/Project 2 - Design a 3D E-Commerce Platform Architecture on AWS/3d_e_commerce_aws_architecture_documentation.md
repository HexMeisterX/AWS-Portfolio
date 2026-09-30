# 3D E-Commerce Platform Cloud Infrastructure Architecture

## Project Overview
This project presents a robust, highly available, secure, and cost-optimized cloud architecture for a next-generation 3D e-commerce web application hosted on Amazon Web Services (AWS). The platform allows global customers to interact seamlessly with high-resolution 3D product models (e.g., furniture, gadgets, fashion items) prior to purchase. 

---

## 1. System Architecture Diagram

![3D E-Commerce AWS Architecture Diagram](Picture1.jpg)

### Architecture Overview Summary
The proposed 3D e-commerce platform uses **Amazon Route 53** for domain management and **Amazon CloudFront** for global content delivery. **Amazon S3** stores 3D product models and other static assets. **AWS WAF** provides web application protection. Traffic to the application is distributed by an **Elastic Load Balancer (ELB)** across **Amazon EC2** instances in two Availability Zones (AZs). 

**Amazon RDS** provides the relational database with a Multi-AZ configuration for high availability, while **Amazon DynamoDB** provides NoSQL storage for product and customer-related data. **Amazon API Gateway** and **AWS Lambda** support API and event-driven processing, while **Amazon SQS** supports asynchronous order processing. **Amazon Cognito** and **AWS IAM** provide identity and access management. **Amazon CloudWatch** provides monitoring and alarms, while **AWS Trusted Advisor** helps with cost, performance, security, and other optimization considerations.

---

## 2. Deep-Dive Architecture Breakdown

### Security Architecture & Controls

Our platform implements a multi-layered, defense-in-depth security architecture to safeguard user data, protect core application logic, and secure high-value 3D assets stored in Amazon S3.

#### Edge Security & Threat Mitigation
* **AWS WAF (Web Application Firewall):** Positioned at the edge to inspect incoming HTTP/HTTPS requests before reaching application servers. Custom rules block common web vulnerabilities, including SQL Injection (SQLi), Cross-Site Scripting (XSS), and automated bot traffic.
* **Amazon CloudFront Origin Access Control (OAC):** Direct public access to the S3 bucket housing 3D assets is restricted. Assets are only accessible via encrypted CloudFront edge locations using HTTPS.

#### Identity & Access Control
* **AWS Cognito:** Handles secure customer registration, user authentication, and authorization. Supports Multi-Factor Authentication (MFA) and OAuth token-based authorization for frontend interaction with Amazon API Gateway.
* **AWS Identity and Access Management (IAM):** Adheres strictly to the Principle of Least Privilege. EC2 instances, AWS Lambda functions, and microservices use IAM roles and temporary credentials to interact with backend databases (DynamoDB and RDS) and SQS queues, eliminating hardcoded access keys.

#### Network Segmentation & Perimeter Security
* **VPC Architecture:** Compute and database components are strictly segregated within a Virtual Private Cloud (VPC) across public and private subnets.
* **Private Subnets:** Amazon EC2 application servers and Amazon RDS databases are hosted exclusively inside private subnets without public IP addresses, shielding them from direct internet exposure.
* **Security Groups & Network ACLs:** Security groups act as stateful virtual firewalls. Incoming traffic to EC2 application instances is strictly limited to ports routed from the Network Load Balancer (NLB). RDS instances accept connections exclusively on port 3306/5432 from the EC2 private security group.

#### Data Protection & Encryption
* **Encryption in Transit:** All communications—from user browser to CloudFront, API Gateway, and internal VPC network flows—are encrypted using TLS/HTTPS protocols.
* **Encryption at Rest:** Sensitive static assets in Amazon S3, application state in DynamoDB, order processing queues in SQS, and relational databases in Amazon RDS are encrypted at rest using AWS Key Management Service (KMS) managed keys.

---

### High Availability & Failover Strategy

To maintain continuous 24/7 service availability and prevent single points of failure across the global 3D e-commerce platform, the design incorporates fault-tolerant AWS services and multi-zone redundancy.

#### DNS & Edge Redundancy
* **Amazon Route 53:** Serves as the authoritative DNS service with built-in health checks. Route 53 automatically routes customer traffic to healthy edge locations and backend endpoints.
* **Amazon CloudFront:** Distributes 3D asset workloads globally across edge locations. If a primary edge cache location experiences degradation, Route 53 and CloudFront dynamically redirect requests to the nearest healthy point of presence.

#### Compute Tier High Availability & Auto Scaling
* **Multi-AZ Infrastructure:** Amazon EC2 instances supporting core application logic are deployed across two distinct Availability Zones (AZ A and AZ B) within the AWS Region.
* **Traffic Load Balancing:** The Network Load Balancer (NLB) continuously monitors the health of EC2 instances across both public/private subnets and automatically redistributes application traffic away from unhealthy nodes.
* **Stateless Microservices:** API tasks and event processing are offloaded to serverless services like Amazon API Gateway, AWS Lambda, and Amazon SQS. Because Lambda functions and SQS run natively across multiple AZs within a region, event processing automatically scales and remains fault-tolerant without server maintenance.

#### Database Tier Failover & Resilience
* **Amazon RDS Multi-AZ Deployment:** Primary database operations run in AZ A with a synchronous, stand-by replica running in AZ B.
* **Automated RDS Failover:** In the event of primary database failure, storage degradation, or network disruption in AZ A, Amazon RDS automatically performs a seamless failover to the standby replica in AZ B. Endpoint connections switch automatically without requiring manual DNS or application configuration changes.
* **DynamoDB Global Replication:** Customer and product catalog data stored in Amazon DynamoDB is automatically replicated across multiple physical facilities within the region, ensuring native high availability and single-digit millisecond latency.

#### Operational Monitoring & Self-Healing
* **Amazon CloudWatch:** Monitors system health metrics (CPU usage, latency, error rates) in real time and triggers alarms if performance thresholds are breached.
* **AWS Trusted Advisor:** Provides automated security checks and architectural guidance to ensure high availability configurations and baseline security policies remain compliant.

---

## 3. Scalability, Performance & Cost Optimization

### 3.1 Scalability
Scalability is basically the system's ability to keep up when more people show up. For a 3D e-commerce platform, this is especially important because traffic doesn't follow a neat schedule. A product launch, a big sale, or even something going viral on social media can send user numbers through the roof within minutes. We chose to look at this as a layered problem — you need the network layer to scale, the compute layer to scale, and the database layer to scale all at the same time. If any one of those breaks down, the whole experience falls apart for the user.

After researching this, we found that the architecture handles scalability at every tier, which is why we think it's a strong design:

* **Elastic Load Balancer (ELB):** Spreads incoming traffic across multiple EC2 instances sitting in two different Availability Zones. ELB scales itself automatically to handle tens of millions of requests per second and conducts health checks to drop unhealthy nodes automatically.
* **EC2 Auto Scaling:** Makes the compute layer elastic by working hand-in-hand with ELB. CloudWatch metrics (e.g., CPU utilization > 70%) trigger scaling actions so new instances come online within minutes during spikes and terminate during quiet hours.
* **AWS Lambda:** Serves as the serverless compute engine that scales from zero. Ideal for short, event-driven jobs like order confirmation, thumbnail generation, or inventory updates without requiring fixed server capacity.
* **Amazon API Gateway:** Managed entry point connecting front-end applications to back-end services. Scales automatically for millions of concurrent API calls while providing request throttling to prevent bot flooding.
* **Amazon DynamoDB:** Handles catalog and session data with on-demand capacity mode, automatically scaling read/write throughput based on real-time traffic spikes without manual intervention.
* **Amazon SQS (Simple Queue Service):** Decouples front-end order intake from back-end processing. During flash sales, thousands of orders sit safely in queues while back-end workers process them steadily, eliminating dropped transactions.

---

### 3.2 Performance
Performance for this platform has two sides to it: how fast the 3D content loads (models, textures, interactive viewer) and how fast everything else responds (search, cart updates, checkout). The 3D content side is particularly challenging because file sizes (e.g., 20–30 MB GLTF files) cause high latency if served from a single region to global users.

Our architecture resolves performance bottlenecks through the following mechanisms:

* **Amazon CloudFront:** Caches static 3D models and assets across 400+ edge locations worldwide. A user in Tokyo loads assets directly from a local Japanese edge cache via HTTP/2, drastically lowering round-trip times.
* **Amazon S3:** High-throughput object store optimized for parallel GET requests. Storing static models in S3 offloads static asset delivery entirely from compute instances.
* **API Gateway + AWS Lambda:** Accelerates transactional operations. Utilizes **Provisioned Concurrency** for critical workflows (like checkout) to eliminate cold-start latencies.
* **Multi-Availability Zone Architecture (EC2 & RDS):** Balances workloads across zones for lower latency. For RDS, read replicas offload query traffic from the primary instance during heavy browsing.
* **Amazon DynamoDB:** Delivers single-digit millisecond responses for session validation and stock lookup. **DynamoDB Accelerator (DAX)** can be added for microsecond read latency on top-selling items.
* **Amazon SQS:** Offloads post-checkout tasks (order emails, PDF receipt generation) asynchronously, allowing the API to respond with instant order confirmation to the user.

---

### 3.3 Cost Optimization
Cost optimization in the cloud is about ensuring you don't pay for capacity you don't need. For a startup, over-provisioning for peak traffic 24/7 leads to substantial idle infrastructure expenses.

This architecture leverages pay-per-use and auto-scaling models to align spending directly with actual traffic:

* **AWS Lambda (No Idle Compute):** Charges strictly per invocation and per millisecond of execution time. Idle time costs $0.
* **Amazon CloudFront (Reduced Origin Server Load):** Caching assets at edge locations reduces origin bandwidth and compute loads on EC2 and S3, lowering per-GB transfer costs as traffic grows.
* **EC2 Auto Scaling & Spot Instances:** Shrinks server counts during off-peak hours. Mixing in EC2 Spot Instances for asynchronous background processing (e.g., rendering thumbnails) cuts instance costs by up to 70–90%.
* **Amazon DynamoDB On-Demand:** Starts with zero capacity commitments, allowing early-stage workloads to pay strictly per request until usage becomes steady enough to transition to provisioned auto-scaling.
* **Amazon SQS (Buffer-Based Sizing):** Prevents the need to over-provision back-end workers for worst-case bursts. Free tier covers the first 1 million monthly requests.
* **Amazon CloudWatch:** Provides real-time visibility into CPU utilization, Lambda counts, and spending thresholds via billing alarms.
* **AWS Trusted Advisor:** Automatically scans the environment to highlight idle EC2 instances, unattached storage volumes, or unutilized load balancers.

---

## 4. Requirements & Architecture Alignment Matrix

| Requirement | How the Architecture Addresses It |
| :--- | :--- |
| **High Availability** | EC2 instances and RDS databases are distributed across two Availability Zones with automated Multi-AZ failover and Route 53 health checking. |
| **Scalability** | ELB traffic distribution, EC2 Auto Scaling, serverless AWS Lambda, API Gateway throttling, and DynamoDB on-demand capacity absorb unpredictable traffic spikes. |
| **Performance** | Amazon CloudFront caches heavy 3D assets globally at edge locations, S3 handles parallel static downloads, and SQS decouples background execution. |
| **Security** | AWS WAF edge filtering, Cognito authentication, IAM least-privilege roles, isolated private subnets, and KMS end-to-end encryption. |
| **Cost Optimization** | CloudFront edge caching, serverless pay-per-use compute, Spot instance integration, CloudWatch billing alarms, and Trusted Advisor optimization scans. |

---

## 5. Trade-Off Analysis & Operational Considerations

### Key Architectural Trade-Offs

1. **Serverless Microservices vs. Monolithic EC2 Compute:**
   * *Trade-off:* Incorporating both EC2 instances and serverless components (Lambda/API Gateway) adds slight operational complexity to deployment pipelines.
   * *Justification:* EC2 provides long-running compute capabilities necessary for complex 3D model processing engines, while Lambda allows cost-free idle execution for transaction APIs.

2. **Relational (RDS) vs. NoSQL (DynamoDB) Database Split:**
   * *Trade-off:* Running a dual-database architecture requires managing two data stores and maintaining synchronization between them.
   * *Justification:* Relational RDS provides strict ACID compliance required for complex financial transactions and inventory accounting, whereas DynamoDB offers high-speed, flexible key-value lookups for user shopping carts and active sessions.

---

### Operational Challenges & Mitigations

* **Lambda Cold Starts:** 
  * *Challenge:* Initial invocation of serverless functions can introduce latency spikes during time-sensitive operations like checkout.
  * *Mitigation:* Implemented AWS Lambda **Provisioned Concurrency** for critical APIs to maintain pre-warmed execution environments.
* **Asynchronous Failure Handling:**
  * *Challenge:* Message failures in Amazon SQS could lead to silent order processing delays.
  * *Mitigation:* Configured SQS **Dead Letter Queues (DLQ)** alongside CloudWatch alarms to isolate and alert on failed message executions for automated retry routines.
* **RDS Failover Latency:**
  * *Challenge:* Multi-AZ failover for Amazon RDS can take between 60 to 120 seconds to complete standard DNS updates.
  * *Mitigation:* Configured connection pooling and back-off retry logic within EC2 application drivers to handle brief database transitions transparently.

---

## 6. Conclusion & Integration Summary

By integrating **Lesego's** robust Multi-AZ and edge-security architecture, **Alneshia's** comprehensive scalability, performance, and cost-control framework, and **Cikizwa's** structural requirement mapping, this cloud design guarantees a reliable, performant 3D shopping experience. The resulting infrastructure successfully meets all technical and business requirements set for a globally scalable startup application on AWS.

---

### Project Completed & Submitted By:
**Lesego, Cikizwa, Alneshia and Reece**