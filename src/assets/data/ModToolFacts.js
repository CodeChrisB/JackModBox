let i = 0
const FACTS = Object.freeze([
  'Right click a file inside the fileviewer to open a menu revaling more options on what you are able to do with it.',
  "The documentation for this tool can be found inside the Settings > About > View Documentatinon",
  "Experiencing, any problems? Submit an issue on github today!",
  'Changing Images is a great way to mod games, such as Job Job.',
  "Sometimes adding more content is better than just replacing content, adding more sounds to Earwax helps make it less repetitive",
  "Clicking on the 3 Dots next to the game name in the sideview gives you an option called 'Export Content' this will let you create a copy of the game files to mod so that you do not overwrite your own files.",
  "The author of this tool discourage to create mods that contain racism, sexism, pedophila, murder and other violent content. You don't have to keep your mods Safe for Work, just ask yourself, what would my mother think about me making those jokes?",
  "There is an option called 'Show all Games without Packs' which lists all Games in a single list, most people like this view more than the standard view",
])


function getFact(){
  i= Math.floor(Math.random()*FACTS.length)
  return FACTS[i]
}

function setNext(val) {
  i+=val
  if(i>FACTS.length-1) i=0
  if(i<0) i=FACTS.length-1
  return FACTS[i]
}
function getPaginationText(){
  return `(${i+1}/${FACTS.length})`
}
const ToolFacts = {
  getFact,
  setNext,
  getPaginationText
}


export default ToolFacts