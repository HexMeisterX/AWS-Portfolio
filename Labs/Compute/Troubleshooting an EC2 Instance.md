<ins>**Troubleshooting an EC2 Instance**<ins>

<ins>Overview:<ins>

In this activity, you use the AWS Command Line Interface (AWS CLI) to launch Amazon Elastic Compute Cloud (Amazon EC2) instances.

When you create the instance, you will reference a user data script to configure the instance to have an Apache web server, a MariaDB relational database (which is a fork of the MySQL relational database), and PHP running on the instance. Together, these software packages installed on a single machine are often referred to as a LAMP stack (Linux, Apache web server, MySQL, and PHP). Using a LAMP stack is a common way to create a website with a database backend on a single machine.

The same user data file will deploy website files and run database configuration scripts on the instance. The result will be an instance that hosts the Café Web Application. 

The following diagram shows the architecture that you will create in this activity.
