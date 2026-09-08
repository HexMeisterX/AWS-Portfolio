<ins>**Troubleshooting an EC2 Instance**<ins>

<ins>Overview:<ins>

In this activity, you use the AWS Command Line Interface (AWS CLI) to launch Amazon Elastic Compute Cloud (Amazon EC2) instances.

When you create the instance, you will reference a user data script to configure the instance to have an Apache web server, a MariaDB relational database (which is a fork of the MySQL relational database), and PHP running on the instance. Together, these software packages installed on a single machine are often referred to as a LAMP stack (Linux, Apache web server, MySQL, and PHP). Using a LAMP stack is a common way to create a website with a database backend on a single machine.

The same user data file will deploy website files and run database configuration scripts on the instance. The result will be an instance that hosts the Café Web Application. 

The following diagram shows the architecture that you will create in this activity:

<img width="735" height="367" alt="Screenshot 2026-09-08 022821" src="https://github.com/user-attachments/assets/547cc779-eb2e-43be-a45a-f076da19462b" />
<br><br>

<ins>Objectives:<ins>
- Launch an EC2 instance by using the AWS CLI.
- Troubleshoot AWS CLI commands and Amazon EC2 service settings by using basic troubleshooting tips and the open-source nmap utility.

<ins>What I did and learned:<ins>
- Connect to the CLI Host EC2 Instance via EC2 Instance Connect
- Viewed the data script for Lamp Instance using VI
- Run the script to create the Lamp Instance
- It fails!

<img width="985" height="371" alt="Screenshot 2026-09-08 025847" src="https://github.com/user-attachments/assets/2434a498-b467-422c-a48c-b792c35311dc" />
<br><br>

- Lab gives a clue to check region in script and fix using VI
- Found the error in region shows "us-east-1"

<img width="314" height="111" alt="Screenshot 2026-09-08 032520" src="https://github.com/user-attachments/assets/92ec7362-ded7-4cd8-9f63-c1fc2da4f151" />
<br><br>

- Fixed the error by replacing us-east-1 with $region
- Ran the script again
- Success!
- Use the new Lamp Instance Public IP to launch the website
- Webpage won't open

<img width="996" height="605" alt="Screenshot 2026-09-08 033517" src="https://github.com/user-attachments/assets/4d741f6d-df2e-4688-a846-72123cd4541d" />
<br><br>

- Lab gives another clue to check security group
- Went back to script and checked
- Found the error is Port 80, its showing 8080

<img width="351" height="118" alt="Screenshot 2026-09-08 035125" src="https://github.com/user-attachments/assets/38a302ec-0c66-4562-a5d9-2d0f391dc5bb" />
<br><br>

- Changed it to Port 80
- Launched the scripted again
- It deleted and created the old instance and security group and made new ones
- Launched webpage again
- Success!

<img width="525" height="332" alt="Screenshot 2026-09-08 040322" src="https://github.com/user-attachments/assets/dcf0a648-7f09-4575-b063-af38ba761271" />
<br><br>
