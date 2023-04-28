import { EditorMode } from "./Editor"
import { CCState } from "./CustomCheckBoxData"
export const Mod = Object.freeze({
    HasTextPrompts:{
        id:0,
        text:"Has Text Prompts"
    },
    TextAsInput:{
        id:1,
        text:"Text As Input"
    },
    AudioAsInput:{
        id:2,
        text:'Audio As Input'
    },
    ImageAsInput:{
        id:3,
        text:'Drawing As Input'
    },
    ChangesWillShowOnDevices:{
        id:4,
        text:"Will show for user"
    },
    HasChangableImages:{
        id:5,
        text:"Changeable Images"
    },
    HasAudienceContent:{
        id:6,
        text:"Has Audience Content"
    },
    PromptsCanBeChanged:{
        id:7,
        text:'Prompts can be changed'
    }  
})


export const GameIds = Object.freeze({
    //pack 1
    ydkj2015: {
        key:"ydkj2015",
        pack:1,
        name: "YDKJ 2015",
        id: '\\The Jackbox Party Pack\\games\\YDKJ2015'
    },
    fibbagexl: {
        key:"fibbagexl",
        pack:1,
        name: "Fibbabge XL", 
        id: '\\The Jackbox Party Pack\\games\\Fibbage' 
    },
    drawful: {
        key:"drawful",
        pack:1,
        name: "Drawful", 
        id: '\\The Jackbox Party Pack\\games\\Drawful',
    },
    wordspud: {
        key:"wordspud",
        pack:1,
        name: "Wordspud", 
        id: '\\The Jackbox Party Pack\\games\\WordSpud' 
    },
    lieswatter: {
        key:"lieswatter",
        pack:1,
        name: "Lieswatter", 
        id: '\\The Jackbox Party Pack\\games\\LieSwatterParty' 
    },
    //pack 2
    bidiots: {
        key:"bidiots",
        pack:2,
        name: "bidiots",
        id: '\\The Jackbox Party Pack 2\\games\\Auction',
        content:{
            fastPrompts:[
                {   
                    key:'name',
                    name:'Fast Edit Prompts',
                    path:'\\content\\EarwaxPrompts.jet'
                }
            ],
        }
    },
    bombcorp: {
        key:"bombcorp",
        pack:2,
        name: "Bomb Corp", 
        id: '\\The Jackbox Party Pack 2\\games\\BombInterns' 
    },
    earwax: {
        key:"earwax",
        pack:2,
        name: "Earwax", 
        id: '\\The Jackbox Party Pack 2\\games\\Earwax',
        content:{
            audioReplaceEditor:[
                {
                    name:'Audio Replace Editor',
                    audioFolder:'content\\EarwaxAudio\\Audio',
                    spectrumFolder:'content\\EarwaxAudio\\Spectrum',
                    dataFile:'content\\EarwaxAudio.jet',
                    expand:false,
                    key:'name'
                }
            ],
            fastPrompts:[
                {   
                    key:'name',
                    name:'Fast Edit Prompts',
                    path:'\\content\\EarwaxPrompts.jet'
                }
            ],
            modability:{
                score:100,
                content:
                [
                    Mod.AudioAsInput.id,
                    Mod.ChangesWillShowOnDevices.id,
                    Mod.PromptsCanBeChanged.id
                ]
            }
        }
    },
    fibbage2: {
        key:"fibbage2",
        pack:2,
        name: "Fibbage 2",                             
        id: '\\The Jackbox Party Pack 2\\games\\Fibbage2' 
    },
    quipplashxl: {
        key:"quipplashxl",
        pack:2,
        name: "Quiplash XL", 
        id: '\\The Jackbox Party Pack 2\\games\\Quiplash' 
    },
    //pack 3
    fakeinit: {
        key:"fakeinit",
        name :"Fakin' It",
        pack:3,
        id: '\\The Jackbox Party Pack 3\\games\\FakinIt'
    },
    guesspionage: {
        key:"guesspionage",
        pack:3,
        name: "Guesspionage", 
        id: '\\The Jackbox Party Pack 3\\games\\PollPosition' 
    },
    quipplash2: {
        key:"quipplash2",
        pack:3,
        name: "Quiplash 2", 
        id: '\\The Jackbox Party Pack 3\\games\\Quiplash2' 
    },
    teeko: {
        key:"teeko",
        pack:3,
        name: "Tee K.O", 
        id: '\\The Jackbox Party Pack 3\\games\\AwShirt' 
    },
    triviamurderparty: {
        key:"triviamurderparty",
        pack:3,
        name: "Trivia Murder Party", 
        id: '\\The Jackbox Party Pack 3\\games\\TriviaDeath' 
    },
    //pack 4
    bracketeering: {
        key:"bracketeering",
        pack:4,
        name: "bracketeering",
        id: '\\The Jackbox Party Pack 4\\games\\Bracketeering'
    },
    fibbage3: {
        key:"fibbage3",
        pack:4,
        name: "Fibbage 3", 
        id: '\\The Jackbox Party Pack 4\\games\\Fibbage3' 
    },
    monstermingle: {
        key:"monstermingle",
        pack:4,
        name: "Monsters Seeking Monsters", 
        id: '\\The Jackbox Party Pack 4\\games\\MonsterMingle' 
    },
    civic: {
        key:"civic",
        pack:4,
        name: "Civic Doodle", 
        id: '\\The Jackbox Party Pack 4\\games\\Overdrawn' 
    },
    surivetheinternet: {
        key:"surivetheinternet",
        pack:4,
        name: "Survive The Internet", 
        id: '\\The Jackbox Party Pack 4\\games\\SurviveTheInternet' 
    },
    //pack 5
    madversecity: {
        key:"madversecity",
        pack:5,
        name: 'Mad Verse City', 
        id: '\\The Jackbox Party Pack 5\\games\\RapBattle',
        content:{
            fastFolders:[
                {
                    name:'Prompts Round 1',
                    path:"content\\RapBattleStandardPromptRound1.jet",
                    editorMode: EditorMode.CustomEditor,
                    editorValues:{
                        noExpansion:true,
                        ccstate:[
                            {a:CCState.OFF},
                            {examples:CCState.IGNORE},
                            {text:CCState.OFF},
                            {type:CCState.IGNORE},
                            {gene:CCState.IGNORE},
                            {x:CCState.IGNORE},
                            {id:CCState.IGNORE},
                        ]
                    }
                }
            ]   
        }
    },
    patentlystupid: {
        key:"patentlystupid",
        pack:5,
        name: 'Patently Stupid', 
        id: '\\The Jackbox Party Pack 5\\games\\PatentlyStupid' 
    },
    splittheroom: {
        key:"splittheroom",
        pack:5,
        name: 'Split the Room', 
        id: '\\The Jackbox Party Pack 5\\games\\SplitTheRoom' 
    },
    ydkj2018: {
        key:"ydkj2018",
        pack:5,
        name: 'YDKJ 2018', 
        id: '\\The Jackbox Party Pack 5\\games\\YDKJ2018' 
    },
    zeepledoome: {
        key:"zeepledoome",
        pack:5,
        name: 'Zeeple Dome', 
        id: '\\The Jackbox Party Pack 5\\games\\SlingShoot' 
    },
    //pack 6
    dictionarium: {
        key:"dictionarium",
        pack:6,
        name: 'Dictionarium', 
        id: '\\The Jackbox Party Pack 6\\games\\Ridictionary' 
    },
    jokeboat: {
        key:"jokeboat",
        pack:6,
        name: 'JokeBoat', 
        id: '\\The Jackbox Party Pack 6\\games\\Jokeboat' 
    },
    pushthebutton: {
        key:"pushthebutton",
        pack:6,
        name: 'Push The Button', 
        id: '\\The Jackbox Party Pack 6\\games\\Quiplash3' 
    },
    rolemodels: {
        key:"rolemodels",
        pack:6,
        name: 'RoleModels', 
        id: '\\The Jackbox Party Pack 6\\games\\RoleModels' 
    },
    triviamurderparty2: {
        key:"triviamurderparty2",
        pack:6,
        name: 'Trivia Murder Party 2', 
        id: '\\The Jackbox Party Pack 6\\games\\TriviaDeath2' 
    },
    //pack 7
    blatherround: {
        key:"blatherround",
        pack:7,
        name: 'Blather Round', 
        id: '\\The Jackbox Party Pack 7\\games\\BlankyBlank' 
    },
    champedup: {
        key:"champedup",
        pack:7,
        name: 'Champed Up', 
        id: '\\The Jackbox Party Pack 7\\games\\WorldChampions' 
    },
    devilsandthedetails: {
        key:"devilsandthedetails",
        pack:7,
        name: 'Devils & Details', 
        id: '\\The Jackbox Party Pack 7\\games\\Everyday' 
    },
    talkingpoints: {
        key:"talkingpoints",
        pack:7,
        name: 'Talking Points', 
        id: '\\The Jackbox Party Pack 7\\games\\JackboxTalks' 
    },
    quipplash3: {
        key:"quipplash3",
        pack:7,
        name: 'Quiplash 3', 
        id: '\\The Jackbox Party Pack 7\\games\\Quiplash3' 
    },
    //pack 8
    drawfulAnimate: {
        key:"drawfulAnimate",
        pack:8,
        name: 'Drawful Animte', 
        id: '\\The Jackbox Party Pack 8\\games\\DrawfulAnimate' 
    },
    wheel: {
        key:"wheel",
        pack:8,
        name: 'The Wheel', 
        id: '\\The Jackbox Party Pack 8\\games\\TheWheel' 
    },
    jobjob: {
        key:"jobjob",
        pack:8,
        name: 'Job Job', 
        id: '\\The Jackbox Party Pack 8\\games\\JobGame',
        content:{
            audioReplacer:[
                {
                    expand:true,
                    hint:"Replace All Narations in game with an Empty Audiofile so that M. Bubble don't narrate your mod wrong.",
                    originalFilename:"question.ogg",
                    path:"content\\en\\ApplyYourselfInterviewQuestion\\",
                    toReplace:"empty.ogg"
                }
            ],
            fastEditFields:[
                //e.g Main Menu or really important stuff . not sure atm...
            ],
            fastFolders:[
                {
                    name:'Poster Folder',
                    path:"content\\ApplyYourselfPosterPhoto",
                    isFolder:true
                },
                {
                    name:'Game Prompts',
                    path:'content\\en\\ApplyYourselfInterviewQuestion.jet',
                    isFolder:false
                }
            ],  
            fastPrompts:[
                {   
                    key:'question',
                    name:'Fast Edit Prompts',
                    path:'\\content\\en\\ApplyYourselfInterviewQuestion.jet'
                }
            ],
            expandFiles:[
                //e.g prompts seperated by id folders maybe adding them  together in a single editor then redistribute them idk
                //or just create 1 arrry out of it and then give every id field one elemnt from the array
            ],
            expandFolders:[],
            modability:{
                score:100,
                content:
                [
                    Mod.TextAsInput.id,
                    Mod.HasTextPrompts.id,
                    Mod.ChangesWillShowOnDevices.id,
                    Mod.HasChangableImages.id,
                    Mod.HasAudienceContent.id
                ]
            }
        }
    },
    pollmine: {
        key:"pollmine",
        pack:8,
        name: 'Poll Mine', 
        id: '\\The Jackbox Party Pack 8\\games\\SurveyBomb' 
    },
    weaponsDrawn: {
        key:"weaponsDrawn",
        pack:8,
        name: 'Weapons Drawn', 
        id: '\\The Jackbox Party Pack 8\\games\\MurderDetectives' 
    },
    //pack 9
    fibbage4: {
        key:"fibbage4",
        pack:9,
        name: 'Fibbage 4',
        id: '\\The Jackbox Party Pack 9\\games\\Fibbage4'
    },
    junktopia: {
        key:"junktopia",
        pack:9,
        name: 'Junktopia',
        id: '\\The Jackbox Party Pack 9\\games\\AntiqueGame'
    },
    nonesensory: {
        key:"nonesensory",
        pack:9,
        name: 'Nonesensory',
        id: '\\The Jackbox Party Pack 9\\games\\RangeGame'
    },
    roomerang: {
        key:"roomerang",
        pack:9,
        name: 'Roomerang',
        id: '\\The Jackbox Party Pack 9\\games\\MakeFriends'
    },
    quixort: {
        key:"quixort",
        pack:9,
        name: 'Quixort',
        id: '\\The Jackbox Party Pack 9\\games\\Lineup'
    }

})
export const JackBoxTreeData = [
    genNode("Pack 1", 1 ,[
        genChildNode(GameIds.drawful),
        genChildNode(GameIds.fibbagexl),
        genChildNode(GameIds.lieswatter),
        genChildNode(GameIds.wordspud),
        genChildNode(GameIds.ydkj2015)
    ]),
    genNode("Pack 2", 2 ,[
        genChildNode(GameIds.bidiots),
        genChildNode(GameIds.bombcorp),
        genChildNode(GameIds.earwax),
        genChildNode(GameIds.fibbage2),
        genChildNode(GameIds.quipplashxl)
    ]),
    genNode("Pack 3", 3,[
        genChildNode(GameIds.fakeinit),
        genChildNode(GameIds.guesspionage),
        genChildNode(GameIds.quipplash2),
        genChildNode(GameIds.teeko),
        genChildNode(GameIds.triviamurderparty)
    ]),
    genNode("Pack 4", 4, [
        genChildNode(GameIds.bracketeering),
        genChildNode(GameIds.fibbage3),
        genChildNode(GameIds.monstermingle),
        genChildNode(GameIds.civic),
        genChildNode(GameIds.surivetheinternet)
    ]),
    genNode("Pack 5", 5,[
        genChildNode(GameIds.madversecity),
        genChildNode(GameIds.patentlystupid),
        genChildNode(GameIds.splittheroom),
        genChildNode(GameIds.ydkj2018),
        genChildNode(GameIds.zeepledoome)
    ]),
    genNode("Pack 6", 6,[
        genChildNode(GameIds.dictionarium),
        genChildNode(GameIds.jokeboat),
        genChildNode(GameIds.pushthebutton),
        genChildNode(GameIds.rolemodels),
        genChildNode(GameIds.triviamurderparty2)
    ]),
    genNode("Pack 7", 7,[
        genChildNode(GameIds.blatherround),
        genChildNode(GameIds.champedup),
        genChildNode(GameIds.devilsandthedetails),
        genChildNode(GameIds.talkingpoints),
        genChildNode(GameIds.quipplash3)
    ]),
    genNode("Pack 8", 8, [
        genChildNode(GameIds.drawfulAnimate),
        genChildNode(GameIds.jobjob),
        genChildNode(GameIds.pollmine),
        genChildNode(GameIds.wheel),
        genChildNode(GameIds.weaponsDrawn)
    ]),
    genNode("Pack 9", 9, [
        genChildNode(GameIds.fibbage4),
        genChildNode(GameIds.junktopia),
        genChildNode(GameIds.nonesensory),
        genChildNode(GameIds.roomerang),
        genChildNode(GameIds.quixort)
    ]),
]

export const AllGames = [genNode('All Games',99,[    
    genChildNode(GameIds.bidiots),
    genChildNode(GameIds.blatherround),
    genChildNode(GameIds.bombcorp),
    genChildNode(GameIds.bracketeering),
    genChildNode(GameIds.champedup),
    genChildNode(GameIds.civic),
    genChildNode(GameIds.devilsandthedetails),
    genChildNode(GameIds.dictionarium),
    genChildNode(GameIds.drawful),
    genChildNode(GameIds.drawfulAnimate),
    genChildNode(GameIds.earwax),
    genChildNode(GameIds.fakeinit),
    genChildNode(GameIds.fibbage2),
    genChildNode(GameIds.fibbage3),
    genChildNode(GameIds.fibbage4),
    genChildNode(GameIds.fibbagexl),
    genChildNode(GameIds.guesspionage),
    genChildNode(GameIds.jobjob),
    genChildNode(GameIds.jokeboat),
    genChildNode(GameIds.junktopia),
    genChildNode(GameIds.lieswatter),
    genChildNode(GameIds.madversecity),
    genChildNode(GameIds.monstermingle),
    genChildNode(GameIds.nonesensory),
    genChildNode(GameIds.patentlystupid),
    genChildNode(GameIds.pollmine),
    genChildNode(GameIds.pushthebutton),
    genChildNode(GameIds.quipplash2),
    genChildNode(GameIds.quipplash3),
    genChildNode(GameIds.quipplashxl),
    genChildNode(GameIds.quixort),
    genChildNode(GameIds.rolemodels),
    genChildNode(GameIds.roomerang),
    genChildNode(GameIds.splittheroom),
    genChildNode(GameIds.surivetheinternet),
    genChildNode(GameIds.talkingpoints),
    genChildNode(GameIds.teeko),
    genChildNode(GameIds.triviamurderparty),
    genChildNode(GameIds.triviamurderparty2),
    genChildNode(GameIds.weaponsDrawn),
    genChildNode(GameIds.wheel),
    genChildNode(GameIds.wordspud),
    genChildNode(GameIds.ydkj2015),
    genChildNode(GameIds.ydkj2018),
    genChildNode(GameIds.zeepledoome)]
)]






function genNode(name, id = null, children = [], disabled) {
    return {
        name: name,
        id: id ?? name,
        children: children,
        disabled: disabled,
    }
}

function genChildNode(obj, disabled) {
    return {
        key: obj.key,
        ...genNode(obj.name, obj.id, [], disabled),
    }
}


function genGamePack(ids){
    return ids.map(x=>genChildNode(x,false))
}

