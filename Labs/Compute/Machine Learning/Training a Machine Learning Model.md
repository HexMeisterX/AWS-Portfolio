<ins>**Training a Machine Learning Model**<ins>

<ins>Overview:<ins>

In this lab, you will explor the biomechanical vertebral column dataset. You will first split the dataset into three separate datasets for training, validation, and testing. You will then use this data to train a machine learning (MML) model by using the XGBoost algorithm.

<ins>Objectives:<ins>
- Split data into training, validation and test datasets
- Train a XGBoost model in Amazon SageMaker

<ins>What I did and what I learned:<ins>
- Open Amazon SageMaker AI in AWS Management Console
- Go to Notebooks subsection and open the notebook provided for this lab in JupyterLab

<img width="1361" height="426" alt="Screenshot 2026-09-23 020745" src="https://github.com/user-attachments/assets/446d5396-c600-433f-9bde-5da551e61f3b" />
<br><br>

- None of the Imported Data is running, it was just throwing up errors for every step I ran.

<img width="582" height="191" alt="Screenshot 2026-09-23 023517" src="https://github.com/user-attachments/assets/b836ec78-b246-439b-b8f3-9a878b8b1207" />
<img width="574" height="262" alt="Screenshot 2026-09-23 023538" src="https://github.com/user-attachments/assets/2860aa6c-946e-4ce6-b966-258953d2f5a0" />
<br><br>

- The lab didn't tell me what was wrong, so I asked Gemini to help
- It said "scipy" is missing and I need to install it 1st
- I ran it and now all the errors are disappearing as I'm running each step of the data

<img width="1021" height="503" alt="Screenshot 2026-09-23 023852" src="https://github.com/user-attachments/assets/b37171c0-9a80-4442-a188-b54705ad4278" />
<br><br>

- Now that the Imported Data is all run successfully had to move onto Step 1 which was exploring the data

<img width="536" height="470" alt="Screenshot 2026-09-23 024723" src="https://github.com/user-attachments/assets/1e12ccce-3d6e-4fb7-85cc-0c276f60162a" />
<br><br>

- Step 2 me preparing the data by moving the target column position
- While trying to split the data, got another error

<img width="546" height="263" alt="Screenshot 2026-09-23 025317" src="https://github.com/user-attachments/assets/ad38a177-c2c6-49bb-be6d-2c55bf212b26" />
<br><br>

- To fix it I consulted Gemini again and was informed there is another package missing in the lab to run this step.
- Installed "scikit-learn" this time and the split data step was successfull

<img width="548" height="468" alt="Screenshot 2026-09-23 025736" src="https://github.com/user-attachments/assets/017a5265-ee99-473a-81fe-ad8151660746" />
<br><br>

- Examined the 3 datasets and checked the distribution of the classes
- Next I had to upload the data to an S3 bucket which was successful
- Step 3 is to train the model

<img width="923" height="394" alt="Screenshot 2026-09-23 030315" src="https://github.com/user-attachments/assets/8ef167e7-ca12-44a4-9fea-4feebf68b2d9" />
<img width="546" height="384" alt="Screenshot 2026-09-23 030734" src="https://github.com/user-attachments/assets/10a94b60-efa1-42a4-a8bb-ba90abcac96f" />
<img width="559" height="336" alt="Screenshot 2026-09-23 030849" src="https://github.com/user-attachments/assets/c2e39de3-5e5f-43cd-9d91-6d743392f4f8" />
<br><br>

- I ran the "fit" script to train the model
- It failed to train the model

<img width="930" height="482" alt="Screenshot 2026-09-23 031346" src="https://github.com/user-attachments/assets/cd1b54dc-192c-4337-86a3-50a94aca0a32" />
<br><br>

- Had to consult Gemini again. This time there was a few fixes in the scripts above I had to fix.
- With Gemini's help again, had to fix the target column, re-split the data, re-upload the data to the S3 bucket, then ran the training again and waited

<img width="547" height="236" alt="Screenshot 2026-09-23 033406" src="https://github.com/user-attachments/assets/3f4f4dac-5c3b-4c2d-8172-ef01bcc33f6f" />

- Successfully completed the training!
