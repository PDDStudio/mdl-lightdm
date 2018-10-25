#mdl-lightdm

[![Greenkeeper badge](https://badges.greenkeeper.io/PDDStudio/mdl-lightdm.svg)](https://greenkeeper.io/)

A Material Design inspired Greeter for LightDM Webkit, based on the work of [Victory Design's entry to the Remix Challenge](http://codepen.io/anon/pen/bdxbJM) 

##Showcase
![Showcase](https://raw.githubusercontent.com/pddstudio/mdl-lightdm/master/mdl-lightdm-demo.gif)

##Requirements
* lightdm
* [lightdm-webkit2-greeter](https://github.com/Antergos/lightdm-webkit2-greeter) by Antergos

##Current Limitation!
* Currently only one user and one session are supported.
**Note:** *Feel free to submit a pull request if you have added this feature in your fork!*

##Instructions
*Be sure to make a backup of the files you modify, you'll need them in case you messed something up or want to remove the theme!
**Important: The configuration and installing instruction down below assumes that you've already installed and configured lightdm-webkit2-greeter!***

### Configuring and Installing
* Download the theme as zip or clone it via git: 
`git clone https://github.com/pddstudio/mdl-lightdm.git`

* Edit the file `./js/ldm-greeter.js` and replace the following part on top of the file: 

```javascript

//username to login with (e.g "pddstudio")
var default_account_name = "your_user_name";
//the session to launch after the login (e.g "Pantheon", "gnome", "Unity", ...)
var default_session_name = "your_session";

```

* Move the directory to `/usr/share/lightdm-webkit/themes/`

* Edit your lightdm-webkit config in `/etc/lightdm/lightdm-webkit2-greeter.conf` 
and set `webkit-theme` to `mdl-lightdm`

**That's it.** After rebooting your workstation (or restarting the lightdm service) you'll have a new materialized greeter!

### Removing

* **Remove mdl-lightdm theme only:**
To remove only this theme all you have to do is changing the `webkit-theme` property to an other theme and deleting the `mdl-lightdm` folder in `/usr/share/lightdm-webkit/themes/` (requires reboot / lightdm service restart)
* **Remove lightdm-webkit to be used as default:**
To remove the lightdm-webkit to be used as default replace your current `etc/lightdm/lightdm.conf` with your backup-config (requires reboot / lightdm service restart)

##Customizing
###Pictures
To change the images in the greeter **(which is recommended as because due to license reasons the theme comes without any background/profile images)** simply place your images in the `./profile/` subfolder and name them as below:
1.) Rename the background picture to `profile_bg.jpg`
2.) Rename the profile/avatar picture to `profile_image.jpg`

*Note:* In case you don't like the names you can change this of course programmatically, too!
The recommend size for the profile image is about 350x350 px.

###Colors
You can change the colors by searching the values below in the `./style.css` file in the root of the directory.
`ripple main bg color:` `#607D8B`
`card bg:` `#FFB300`
`intro fab color:` `#2979FF`
`intro fab color after transition:` `#E0E0E0`

##Misc. Information
* In case you don't see any graphics or the theme isn't looking as it actually should, make sure you've set the right permissions to the files
* If you want to contribute to this little goodie, feel free to submit a pull request, I'd appreciate any help for new features or bugfixes

##Used Ressources
* [Pen by Victory Design](http://codepen.io/anon/pen/bdxbJM)
* [Material Design Lite by Google](http://github.com/google/material-design-lite)
* [JS-Snippets from Antergos lightdm-webkit-theme](https://github.com/Antergos/lightdm-webkit-theme-antergos) 

##Contact
* Patrick J <patrick.pddstudio@gmail.com> 
* [Patrick J Google+](https://plus.google.com/+PatrickJung42)
#
* VictoryDesign: [Homepage](http://victory-design.ru/)