export const GameIds = Object.freeze({
    //pack 1
    ydkj1:'ydkj1',
    fibbagexl:'fibbagexl',
    drawful:'drawful',
    wordspud:'wordspud',
    lieswatter:'lieswatter',
    //pack 2
    //pack 3
    //pack 4
    bracketeering:{name:"Braketeering",id:'\\The Jackbox Party Pack 4\\games\\Bracketeering'},
    fibbage3:{name:"Fibbage 3",id:'\\The Jackbox Party Pack 4\\games\\Fibbage3'},
    monsterMingle:{name:"Monster Mingle",id:'\\The Jackbox Party Pack 4\\games\\MonsterMingle'},
    civic:{name:"Civic Doodle",id:'\\The Jackbox Party Pack 4\\games\\Overdrawn'},
    surivetheinternet:{
        key:"surivetheinternet",
        name:"Survive The Internet",
        id:'\\The Jackbox Party Pack 4\\games\\SurviveTheInternet'
    },
    //pack 5
    //pack 6
    //pack 7
    //pack 8
    drawfulAnimate:{name:'Drawful Animte',id:'\\The Jackbox Party Pack 8\\games\\DrawfulAnimate'},
    wheel:{name:'The Wheel',id:'\\The Jackbox Party Pack 8\\games\\TheWheel'},
    jobjob:{name:'Job Job',id:'\\The Jackbox Party Pack 8\\games\\JobGame'},
    pollmine:{name:'Poll Mine',id:'\\The Jackbox Party Pack 8\\games\\??'},
    weaponsDrawn:{name:'Weapons Drawn',id:'\\The Jackbox Party Pack 8\\games\\??'}
    //pack 9
    
})
export const JackBoxTreeData = [
    genNode("Pack 1",1),
    genNode("Pack 2",2),
    genNode("Pack 3",3),
    genNode("Pack 4",4,[
        genChildNode(GameIds.bracketeering,true),
        genChildNode(GameIds.fibbage3,true),
        genChildNode(GameIds.monsterMingle,true),
        genChildNode(GameIds.civic,true),
        genChildNode(GameIds.surivetheinternet)
    ]),
    genNode("Pack 5",5),
    genNode("Pack 6",6),
    genNode("Pack 7",7),
    genNode("Pack 8",8,[
        genChildNode(GameIds.drawfulAnimate,true),
        genChildNode(GameIds.wheel,false),
        genChildNode(GameIds.jobjob,true),
        genChildNode(GameIds.pollmine,true),
        genChildNode(GameIds.weaponsDrawn,true)
    ]),
    genNode("Pack 9",9),
]



function genNode(name,id=null,children=[],disabled){
    return {
        name:name,
        id:id??name,
        children:children,
        disabled:disabled,
    }
}

function genChildNode(obj,disabled){
    return {
        key:obj.key,
        ...genNode(obj.name,obj.id,[],disabled),
    }
}


