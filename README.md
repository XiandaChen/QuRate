# QuRate Overview

QuRate is a quality-aware and user-centric frame rate adaptation mechanism to tackle the power consumption issue in immersive video streaming (a.k.a., 360-degree video streaming) on smartphones, which is described in our recently accepted MMSys 2020 paper:

Nan Jiang, Yao Liu, Tian Guo, Wenyao Xu, Viswanathan Swaminathan, Lisong Xu, Sheng Wei, QuRate: Power-Efficient Mobile Immersive Video Streaming, ACM Multimedia Systems Conference, to appear, June 2020.

QuRate optimizes the immersive video power consumption by modeling the correlation between the perceivable video quality and the user behavior. Specifically, it builds on top of the user's reduced level of concentration on the video frames during view switching and dynamically adjusts the frame rate without impacting the perceivable video quality.

This repository contains the source code, tools, and detailed setup instructions needed to run the end-to-end 360-degree video streaming system with QuRate in place, which can be used to conduct the power measurements and obtain the power evaluation results reported in the paper. In particular, we provide the following three versions of the system for the readers who would like to reproduce QuRate results at various levels.
* Default, the original 360-degree video streaming system without power optimization;
* QuRate_verbose, the version of QuRate with frame rate output, for the readers to observe the effects of QuRate without conducting power measurements; and
* QuRate, the version of QuRate for power evaluations using the power monitor.


# Repository Hierarchy

```
 |-----player                          // Player for each video
       |-----original
       |-----qurate_fr_observation
       |-----qurate_power_measurement
 |-----src
       |-----dash                     // JS of DASH streaming
       |-----webvr_fr_observation     // JS of QuRate_verbose for frame rate observation
       |-----webvr_original           // JS of Default VR video playback
       |-----webvr_power_measurement  // JS of QuRate for power measurement
 |-----video                          // DASH-ed video files
       |-----1 //DASH-ed video 1
       |-----2 //DASH-ed video 2
       |-----3 //DASH-ed video 3
       |-----4 //DASH-ed video 4
       |-----5 //DASH-ed video 5
       |-----6 //DASH-ed video 6
 |-----tool
       |-----chromium_webvr_v1_android.apk   // special version of Chromium browser
 |-----QuRate.html                     // main page of QuRate
```

# Hardware and Software Requirements
### Hardware Requirements
* An Android smartphone as the mobile HMD. In our experiments, we have tested QuRate with LG V20, Samsung S7, Moto G5, LG G4, and Google Pixel 1. Other Android phones may also work but have not been tested with. 
* A desktop or laptop computer as the web server.
* (Optional) an Monsoon power monitor (https://www.msoon.com/online-store), if the readers would like to conduct power evaluation on QuRate.
* (Optional) A cable to connect the smartphone with the computer, if the readers chose to use the "Remote devices" feature of Chrome (i.e., Method 2 under the QuRate_verbose mode).


### Software Requirements
* Test videos (under the "video" folder of this repository) were obtained from the following dataset paper:

      Xavier Corbillon, Francesca De Simone, and Gwendal Simon, 360-Degree Video Head Movement Dataset. ACM Multimedia Systems Conference (MMSys), pp. 199–204, 2017. 
* A special version of Chromium browser `chromium_webvr_v1_android.apk` (under the "tool" folder of this repository).

# System Setup

1. Install the special version of Chromium `chromium_webvr_v1_android.apk` on the smartphone. (The provided version is tested and guaranteed to work. Some other browsers maybe work as well.)
1. Setup a server on the computer. ([XAMPP](https://www.apachefriends.org/index.html) on Windows 10 and [Apache](https://httpd.apache.org/) on Linux system is tested and guaranteed to work. Other server setups should also work.)
1. Clone all the source files into the folder of the server on the computer. Make sure all the files can be accessed using the browser from the smartphone (i.e., Make sure the smartphone and the PC are in the same wireless connection).


# Running immersive video streaming with and without QuRate
This section introduces how to watch the immersive video with and without the QuRate enabled, which includes "Default" and "QuRate_verbose" modes from the playlist. You will be able to observe the frame rate reduction in the "QuRate_verbose" mode. For power measurement with the "QuRate" mode, please refer to the "Power measurement" section. Below are the steps to set up the player and the details for evaluation. 

1. On smartphone, type `path-to-localhost-folder/QuRate.html` in the URL bar of the Chromium.
1. Choose a video from the playlist. 
1. (**IMPORTANT**) Before playback, make sure the smartphone is vertical.
1. Click on "**LOAD PLAYER**", "**Play**", and "**Enter VR**" buttons in turns to enable VR video playback.
1. View the video in any HMD for a better experience.
1. Exit the full-screen mode. Click "**Back to play list**" button to go back to the playlist for other videos.

### Default mode
1. Choose any video from the Default list.
1. Follow the above steps to view the VR video.

### QuRate_verbose mode
1. Choose any video from the "QuRate_verbose" list.
1. Choose any of the following two methods.

###### Method 1: directly observe the frame rate output from the browser page
1. Set the system up. 
1. Do not enter the VR mode.
1. Move the smartphone quickly and keep monitoring the number changing from the browser where it says, "Frame rate is XX FPS".
* **NOTE**, in Method 1, you do not need to enter VR mode to view the frame rate change because the WebVR library is working once the page is loaded. However, it might be hard to catch the change by human eyes since the smartphone is moving back and forth quickly.

###### Method 2: "Remote devices" feature of Chrome
1. Open a Chrome browser on the computer.
1. Set up the "Remote devices" feature on Chrome following [this link](https://developers.google.com/web/tools/chrome-devtools/remote-debugging?utm_campaign=2016q3&utm_medium=redirect&utm_source=dcc).
1. Make sure the smartphone has debug mode enabled following [this link](https://www.youtube.com/watch?v=Ucs34BkfPB0).
1. Connect smartphone and computer with the cable.
1. Enter the VR mode.
1. Observe the frame rate output in the console log of the smartphone on the computer.
* **NOTE**, frame rate reduction only happens when the smartphone is moving.

### QuRate mode
1. Choose any video from the "QuRate" list.
1. Follow the same steps as in "Default mode" to view the VR video in this mode.

QuRate mode is for power measurement. For details about this mode, please refer to the "Power measurement" section for setup.

# Power measurement
This section introduces how to measure and compare the power consumption of "Default" and "QuRate" modes from the playlist. Please refer to the previous section for the steps to set up the player. Below are the details to set up the power monitor. 

1. Refer to the [guide](https://msoon.github.io/powermonitor/PowerTool/doc/Power%20Monitor%20Manual.pdf) of the power monitor tool to connect the smartphone and computer. **Make sure the smartphone is charged by the power monitor, not any cable.** The power monitor can be controlled by the power tool application on the computer. 
1. The setup requires modification to the battery system of the smartphone. It will be easier if the smartphone has a removable battery. The details can be found in [this link](https://mostly-tech.com/tag/monsoon-power-monitor/).
1. Load the videos from the "Default" or "QuRate" list, with the same steps as introduced in previous section.
1. Compare power consumption when playing the same video with different modes.

* **NOTE**, power reduction is more obvious when the smartphone is constantly moving at high speed.

# Known Issue

* Might not work for all browsers. The provided chromium browser apk has been tested to work.
* The playback might fail if the video is entered when the phone is in horizontal mode. 

# License
MIT
