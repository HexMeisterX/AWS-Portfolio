<ins>**Create a VPC & Run a Simple App in it**<ins>

<ins>Objectives:<ins>
- Configure a virtual network. 
- Place an Amazon Linux EC2 instance into this virtual network.
- Install a web server, and deploy and run a simple application on it.

<ins>What I did & what I learned:<ins>
- Open AWS Management Console navigated to VPC dashboard
- I had to create a VPC, then created a Subnet, created the Internet Gateway next, and lastly the Route Table
- Attached the Internet Gateway to the VPC
- Back to Route Table, under Route tab, configured a route to Internet Gateway
- Also under Route Table, under Subnet Association tab, selected Subnet
- VPC completed
- Now to EC2 dashboard
- Created a Security Group, configured Inbound and Outbound rules

<img width="1363" height="569" alt="Screenshot 2026-10-14 024826" src="https://github.com/user-attachments/assets/53445a38-8e00-4c5f-b542-f3c1e23e26a5" />
<br><br>

- Created EC2 Instance for my Web Server including this script:

#!/bin/bash
yum update -y
yum install -y httpd
systemctl start httpd
systemctl enable httpd
usermod -a -G apache ec2-user
chown -R ec2-user:apache /var/www/html
chmod 2775 /var/www/html
find /var/www/html -type d -exec chmod 2775 {} \;
find /var/www/html -type f -exec chmod 0664 {} \;

- Now with the Instance created, I logged in with Instance Connect
- Failed!, getting error:

<img width="1366" height="225" alt="Screenshot 2026-10-14 030642" src="https://github.com/user-attachments/assets/8b01bcb8-6758-4620-a4c8-c9f14ef8abe6" />
<br><br>

- Waited 2 minutes and tried again, same error.
- Consulted Gemini on the error
- I went to check Security Group, Inbound rule HTTP is set for all IPv4 traffic and SSH is set as my IP
- Tried again... Same error.
- Went back to Security Group, changed Inbound rule SSH to allow all IPv4 traffic too.
- Tried Instance Connect again... Success!

<img width="1366" height="574" alt="Screenshot 2026-10-14 031134" src="https://github.com/user-attachments/assets/c85e9541-5bf0-49f6-be23-4171f7275d1e" />
<br><br>

- Created a nano file > projects.html
- Pasted this in:

<!DOCTYPE html>
<html>
<body>
<h1>Reece's re/Start Project Work</h1>
<p>EC2 Instance Challenge Lab</p>
</body>
</html>

- Saved the file then used the Instance IP with the project.html name in my URL

<img width="742" height="232" alt="Screenshot 2026-10-14 032018" src="https://github.com/user-attachments/assets/8b3935b9-a09f-437e-acdb-c84c1db97fa8" />

- Success!
