### Deploy CloudFormation template

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

---

**Note, this CloudFormation stack creation will take 10-15 minutes... This is because a CloudFront distribution is created as part of the stack, and it takes a while to propagate settings to all edge locations. All other resources are created within a few minutes.**

---

*Refresh the stack creation page every few minutes until the Status has changed to **CREATE_COMPLETE***.

![](images/cf-create-stack-4.png?width=40pc&classes=border,shadow)

### Open the Operator User Interface
When the CloudFormation stack deployment is completed, it will produce some outputs. Go to the **Outputs** tab to get your unique operator control interface URL. It is the value for key **DashboardUrl**

![](images/cf-create-stack-5.png?width=60pc&classes=border,shadow)

Open the URL in a new tab on your browser. There are 3 key areas to note in the controller interface:

1. **Channel Status:** An API call is performing regular calls to your MediaLive channel to track the state. As we've only just created the channel, it should be in IDLE state

2. **MediaLive Control Functions:** This menu contains all of the actions we can perform using this interface. Select on one of the options to further expand the controls

3. **Video Player:** For this workshop we are utilizing the HTTP Live Streaming (HLS) over-the-top streaming format, and the embedded video player is video-js

![](images/medialive-controller-1.png?width=60pc&classes=border,shadow)

{{% notice info %}}
Your video player may likely display an error. That's because it's attempted to play your live stream, but as you've not streamed any content yet, there's nothing for it to load
{{% /notice %}}

### Start your channel

Select the **Start/Stop Channel** menu button, then select **Channel Start**. A window prompt will ask you if you're sure you want to start the channel, select **Ok**

*You will notice your channel state change becomes STARTING*

![](images/medialive-controller-2.png?width=20pc&classes=border,shadow)

Wait until your Channel Status says **RUNNING**, then Refresh the browser page. The video player will now reload successfully and allow you to start playing your live stream

![](images/medialive-controller-3.png?width=60pc&classes=border,shadow)

---

NOTE: You will likely see a 10-15 second delay when performing input switch commands and graphics activations. The actions are performed IMMEDIATELY, however, because the playback is happening with HLS, there is a delay in seeing the effects of your commands

---

### Switch Input

There are 3 inputs attached to your channel:

1. **Live HLS input**: This is being sourced from a Channel Assembly channel. All participants are connected to this same stream

2. **Dynamic MP4 input** with source end behavior set to LOOP: Any time this input is selected, MediaLive will continually loop the file until another input switch is made

3. **Dynamic MP4 input** with source end behavior set to CONTINUE: Any time this input is selected, MediaLive will play the file once, and then will play subsequent items in the schedule

Select the **Switch Input** menu button and try out the different behaviors... The **Looping File Switch** is typically used to load a slate prior to and after a live event. The **Bumper File Switch** can be used for rudimentary ad insertion on lower tier live events. The **Live Input Switch** is good for switching from the looping slate back to live stream when the event starts.

![](images/medialive-controller-4.png?width=60pc&classes=border,shadow)

### Static Graphic Overlay

MediaLive can overlay static graphics on the video frame from image formats bmp, png, and tga. The service supports up to 8 layers of images at any time. The overlays are positioned/anchored to X and Y pixels on the video frame. If you specify a duration of '0' for the activation, the overlay will remain on the video frame until its explicitly deactivated or another image is loaded on the same layer, otherwise specify a duration in seconds and the overlay will deactivate at the end of that time. Image opacity and fade tranitions are also supported for this feature.

For this demo, a number of images have been pre-populated, as well as rendering positions on the video frame. Select an image from the list, specify a location, and choose your duration and fade transition. This demo uses a single layer, so if you make changes when an overlay is activated, your command will override the current layout.

![](images/medialive-controller-staticgfx.png?width=60pc&classes=border,shadow)

### HTML5 Motion Graphics

The MediaLive Controller is preconfigured to work with four HTML5 compositions. Try each of them out individually, or altogether! Have fun, and let's see what you come up with.

![](images/medialive-controller-5.png?width=30pc&classes=border,shadow)

1. **HTML5 ticker:** Create a custom title and scroll message at the foot of the video frame

![](images/medialive-controller-html5-1.png?width=30pc&classes=border,shadow)

2. **HTML5 score:** An example of a live soccer scoreboard, complete with teams, score updates, and game timing

![](images/medialive-controller-html5-2.png?width=30pc&classes=border,shadow)

3. **HTML5 lower third:** Create a custom message header and added text to add more context to the message

![](images/medialive-controller-html5-3.png?width=30pc&classes=border,shadow)

4. **HTML5 bug:** Social media is everywhere these days, encourage your viewers to follow you on the various social media platforms

![](images/medialive-controller-html5-4.png?width=30pc&classes=border,shadow)


