#### Deploy CloudFormation template

1. Download the CloudFormation template from [here](https://raw.githubusercontent.com/scunning1987/medialive_single_channel_controller/main/medialive_single_channel_controller.yaml)
2. Right-click on the page that opens and select **Save Page As**. Choose a folder locally to save the template

![](images/cloudformation-template-save.png?width=50pc&classes=border,shadow)

3. Access the AWS Console using the credentials provided. Confirm you're in the right AWS region selecting it from the dropdown of the toolbar at the top of the AWS console

![](images/region.png?width=20pc&classes=border,shadow)

4. Navigate to the CloudFormation service. You can do this by:

- ...selecting the Services drop-down list, then **Management & Governance**, then select **CloudFormation**

or

- ...using the Find Services search box and typing in **CloudFormation**, and select the service from the list of results

![](images/navigate-to-cloudformation.png?width=50pc&classes=border,shadow)

5. Select the Create Stack button

6. In Step 1, Choose **Template is ready**, then **Upload a template file**. Select the **Choose file** button and navigate to the CloudFormation template downloaded in the previous step. Then select **Next**

![](images/cf-create-stack-1.png?width=50pc&classes=border,shadow)

7. In Step 2 you need to enter parameters unique to your setup.

   a. **Stack Name:** enter your full name here, this will be used in the naming convention of most resources that get created by this template

   b. **HTML5CompositionEndpoint:** This is the URL for your HTML composition endpoint

   c. **HTML5CtrlEndpoint:** This is the control API endpoint

8. For Step 3, leave everything as the default and scroll down to the bottom and select **Next**

9. In Step 4, scroll to the bottom of the review page and select the check mark in the acknowledge box. Then select **Create stack**

![](images/cf-create-stack-2.png?width=50pc&classes=border,shadow)

Congratulations, you're now deploying an end to end video pipeline and control application

![](images/cf-create-stack-3.png?width=40pc&classes=border,shadow)

{{% notice info %}}
Note, this CloudFormation stack creation will take 10-15 minutes... This is because a CloudFront distribution is created as part of the stack, and it takes a while to propagate settings to all edge locations. All other resources are created within a few minutes.
{{% /notice %}}

---

*Refresh the stack creation page every few minutes until the Status has changed to **CREATE_COMPLETE***.

![](images/cf-create-stack-4.png?width=40pc&classes=border,shadow)

#### Open the Operator User Interface
When the CloudFormation stack deployment is completed, it will produce some outputs. Go to the **Outputs** tab to get your unique operator control interface URL. It is the value for key **DashboardUrl**

![](images/cf-create-stack-5.png?width=60pc&classes=border,shadow)
