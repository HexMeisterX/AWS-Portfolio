<ins>**Working with AWS Lambda**<ins>

In this lab, you deploy and configure an AWS Lambda based serverless computing solution. The Lambda function generates a sales analysis report by pulling data from a database and emailing the results daily. The database connection information is stored in Parameter Store, a capability of AWS Systems Manager. The database itself runs on an Amazon Elastic Compute Cloud (Amazon EC2) Linux, Apache, MySQL, and PHP (LAMP) instance.

The following diagram shows the architecture of the sales analysis report solution and illustrates the order in which actions occur:

<img width="633" height="342" alt="Screenshot 2026-06-27 233707" src="https://github.com/user-attachments/assets/94600489-f6b4-46ee-878b-4b3bc0e846dc" />

<ins>**Objectives**<ins>
- Recognize necessary AWS Identity and Access Management (IAM) policy permissions to facilitate a Lambda function to other Amazon Web Services (AWS) resources.
- Create a Lambda layer to satisfy an external library dependency.
- Create Lambda functions that extract data from database, and send reports to user.
- Deploy and test a Lambda function that is initiated based on a schedule and that invokes another function.
- Use CloudWatch logs to troubleshoot any issues running a Lambda function.

<ins>**What did I learn**<ins>
- To create a Layer
- To create a Function
- Add the Layer to the Function
- Set up the the Network for the Function
- Edit a Security Group Inbound to allow Port needed
- Confirmed Function is working correctly with a test.
