<template lang="pug">
div
  div(style="min-height:18vh")
  div.container(style="min-width:100%;height:100%")
    v-img.img(
      max-width="25vw"
      :src="require(`@/assets/images/mainMenu/waterdrop${getRandomInt(maxWaterDropIndex)}.png`)"
      )
  div.text-center.text-medium-emphasis
    p.text-disabled {{ slogans[getRandomInt(slogans.length-1)] }}
</template>

<script> 

export default {
  name: 'HomeView',
  data(){
    return {
      maxWaterDropIndex:5,
      slogans:[
        "Drawful - Artistic deception at its finest",
        "Fibbage XL - Can you spot the lies?",
        "Lie Swatter - True or false? Think fast!",
        "Word Spud - The game that's all potatoes",
        "You Don't Know Jack 2015 - Trivia with a twist",
        "Bidiots - Where bad art meets good profits",
        "Bomb Corp - Defuse bombs with friends",
        "Earwax - Sounds gross, plays great",
        "Fibbage 2 - Fool your friends with more lies",
        "Quiplash XL - The ultimate battle of wits",
        "Quiplash 2 - The hilarity continues",
        "Trivia Murder Party - Survive the night",
        "Guesspionage - The art of espionage",
        "Tee K.O. - Design your own t-shirts",
        "Fakin' It - Who's the faker?",
        "Bracketeering - Outrageous arguments",
        "Civic Doodle - Make your mark on the city",
        "Fibbage 3 - More outrageous lies",
        "Monster Seeking Monster - Date monsters!",
        "Survive the Internet - The web is your enemy",
        "You Don't Know Jack - The classic trivia game",
        "Split the Room - Create divisive scenarios",
        "Mad Verse City - Battle with rhymes",
        "Patently Stupid - Pitch your wacky inventions",
        "Zeeple Doom - Space adventure awaits",
        "Dictionarium - Define new words",
        "Joke Boat - Make your audience laugh",
        "Push the Button - Who can you trust?",
        "Role Models - Learn what you're made of",
        "Trivia Murder Party 2 - It's back, and deadlier than ever",
        "Blather 'Round - Hilarious descriptions",
        "Champ'd Up - Who is the ultimate champion?",
        "Quiplash 3 - The three-quel you've been waiting for",
        "Talking Points - The power of persuasion",
        "The Devils and the Details - Survive family life",
        "Drawful Animate - Draw, animate, and laugh",
        "The Wheel of Enormous Proportions - Spin to win",
        "Job Job - The job interview game",
        "The Poll Mine - Answer hilarious questions",
        "Weapons Drawn - Draw your way to victory",
        "Fibbage 4 - Lying never felt so good",
        "Quixort - Puzzles that are out of this world",
        "Junktopia - Who can make the best junk?",
        "Nonsensory - A game that defies logic",
        "Roomerang - The game that comes back to you",
        "There is a 2.17% chance to see this prompt!"
      ]
    }
  },
  methods:{
    getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
    }
  }
}
</script>

<style scoped>
.container{
  display: flex;
  justify-content: center;

  align-items: center;
}
.img{
  opacity: 0.5;
}
</style>
