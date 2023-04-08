###### Editors
Editors are the main focus of JackModBox they are focused on making the modding process easier, there are several diffrent editors all having different abilities.
Some Editors focus on specific tasks other's can be used to mod almost everything that is possible. The usefulness of the editors depends hugely on the usecase.

---

###### Monaco Editor (Code Editor)
This is a basic text editor that that aims to simulate the visual studio code UI  

When trying to save the content of a file the editor checks if the file is still a  
valid JSON.

---

###### Custom Editor (Card Editor)
A code free editor of JSON Objects, this editor aims to make editting easier  

[icon mdi-magnify] Click to open the search menu

Inside the Custom editor the menu also features  toggle checkboxes for each property of the json file.
The Checkbox has 3 states :
[icon mdi-checkbox-blank-outline] - Off
[icon mdi-checkbox-marked] - Search
[icon mdi-checkbox-blank-off-outline] - Ignore (Do not show this property)

---

###### Fast Prompt Editor 
An even easier to use editor that just displays all prompts of a given file , line per line.
On save the editor redistributes the values back into the JSON File.

~~ Note: This editor some times has a bug where the user is able to delete a line, please do not try to delete lines anyways, but if you do keep in mind that this editor goes through all lines and redistributes them into the orignial JSON if 3 lines were deleted by the user the last 3 lines of the original JSON will not be updated, since there is no data to update it with.

---

###### Audio/Image Prompt Editor
This editor let's the user change an audio/image and the corresponding text.

~~ Currently only audio replacement is supported. Image Replacement will me implemented at a later time.