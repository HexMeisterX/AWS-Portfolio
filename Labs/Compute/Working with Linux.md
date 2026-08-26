<ins>**Working with Linux**<ins>

<ins>Lab Overview:<ins>

In this lab, you use the AWS Command Line Interface (AWS CLI) to create an Amazon Elastic Compute Cloud (EC2) instance to host a web server and create an Amazon Machine Image (AMI) from that instance. You then use that AMI as the basis for launching a system that scales automatically under a variable load by using Amazon EC2 Auto Scaling. You also create an Elastic Load Balancer to distribute the load across EC2 instances created in multiple Availability Zones by the auto scaling configuration. 

<ins>Objectives:<ins>
- Create an EC2 instance by using an AWS CLI command.
- Create a new AMI by using the AWS CLI.
- Create an Amazon EC2 launch template.
- Create an Amazon EC2 Auto Scaling launch configuration.
- Configure scaling policies and create an Auto Scaling group to scale in and scale out the number of servers based on a variable load.

<ins>What I did and learned:<ins>
- SSH into the labs pre-created EC2 Instance
- Created an EC2 Instance via CLI

<img width="1365" height="575" alt="Screenshot 2026-08-20 195902" src="https://github.com/user-attachments/assets/4284c4d0-155b-4ac7-a448-71c8f8222aa4" />

- Got the newly created Instance ID and Public DNS address
- Ran the DNS page to see it open

<img width="948" height="446" alt="Screenshot 2026-08-20 201124" src="https://github.com/user-attachments/assets/6504c0fd-46c1-4ebd-9a56-b8b34bcfede3" />

- Created an AMI of the new Instance
- Created a Load Balancer, a Launch Template and an Auto Scaling Group on AWS Console
- Generate a stress test to check that Auto Scaling works
- Cloudwatch Alarms that was created by Auto Scaling polies will detect the high CPU usage and then launch extra Instances to accommodate the increased load

<img width="1366" height="517" alt="Screenshot 2026-08-20 212139" src="https://github.com/user-attachments/assets/eb341f37-a08d-4254-82f8-1479c0add3e0" />

<img width="1366" height="556" alt="Screenshot 2026-08-20 212417" src="https://github.com/user-attachments/assets/461d13a9-3a68-42cd-964e-d9a885527df4" />

