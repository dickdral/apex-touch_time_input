# Oracle APEX Dynamic Action Plugin -  Resize Dialog
Oracle Apex for resizing modal dialogs. 

In the attributes a margin and whether the dialog should be centered can be specified. 

## Change history
- V1.0    Initial version

## Requirements
The plugin can be used with Apex 5.0 and Apex 5.1 in applications using Universal Theme. 

## Install
- Import plugin file "dynamic_action_plugin_nl_detora_apex_touch_time_input.sql" from source directory into your application
- At installation you will be prompted for the default time format. This can be changed after the installation at any time. 
- You can use the plug-in in a click event on a button, for example a time picker button
- In the plug-in point to the item where the time should be placed in and the base of the time window

## Plugin Settings
The plugin settings are customizable and you can change:
- **Time format** - Time format for return value
- **Window base** - base value of the time window ( default 7, so time window is 7:00 to 18:55 )
## Demo Application
http://www.speech2form.com/ords/f?p=OPFG:TIME_INPUT_DEMO

## Preview
![](https://raw.githubusercontent.com/dickdral/apex-touch_time_input/master/apex-touch_time_input_example.gif?raw=true)
---
