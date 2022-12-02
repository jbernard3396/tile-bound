//key value object with key as csv code, and value as logical game element
objectDictionary = {
    '.': {
        type: '',
        variations: []
    },
    '=': {
        type: 'tile-seperator',
        variations: []
    },
    '#': {
        type: 'ground',
        variations: [
        {
            requirements: ['Surrounded_Deep_Stone_csv'],
            tiles: ['Surrounded_Deep_Stone.png']
        },
        {
            requirements: ['Left_Standing_Grass_csv'],
            tiles: ['Left_Standing_Grass.png']
        },   
        {
            requirements: ['Middle_Standing_Grass_csv'],
            tiles: ['Middle_Standing_Grass.png']
        },
        {
            requirements: ['Right_Standing_Grass_csv'],
            tiles: ['Right_Standing_Grass.png'],
        },
        {
            requirements: ['Left_Standing_Side_csv'],
            tiles: ['Left_Standing_Side.png'],
        },
        {
            requirements: ['Left_Floating_Grass_csv'],
            tiles: ['Left_Floating_Grass.png'],
        },
        {
            requirements: ['Right_Standing_Side_csv'],
            tiles: ['Right_Standing_Side.png'],
        },
        {
            requirements: ['Right_Floating_Grass_csv'],
            tiles: ['Right_Floating_Grass.png'],
        },
        {
            requirements: ['Left_Under_Stone_csv'],
            tiles: ['Left_Under_Stone.png'],
        },
        {
            requirements: ['Left_Deep_Stone_csv'],
            tiles: ['Left_Deep_Stone.png'],
        },
        {
            requirements: ['Left_Deep_Bottom_Stone_csv'],
            tiles: ['Left_Deep_Bottom_Stone.png'],
        },
        {
            requirements: ['Middle_Under_Stone_csv'],
            tiles: ['Middle_Under_Stone.png'],
        },
        {
            requirements: ['Middle_Deep_Stone_csv'],
            tiles: ['Middle_Deep_Stone.png'],
        },
        {
            requirements: ['Middle_Deep_Bottom_Stone_csv'],
            tiles: ['Middle_Deep_Bottom_Stone.png'],
        },
        {
            requirements: ['Middle_Floating_Grass_csv'],
            tiles: ['Middle_Floating_Grass.png'],
        },
        {
            requirements: ['Right_Under_Stone_csv'],
            tiles: ['Right_Under_Stone.png'],
        },
        {
            requirements: ['Right_Deep_Stone_csv'],
            tiles: ['Right_Deep_Stone.png'],
        },
        {
            requirements: ['Right_Deep_Bottom_Stone_csv'],
            tiles: ['Right_Deep_Bottom_Stone.png'],
        },
        {
            requirements: ['Isolated_Floating_Stone_csv'],
            tiles: ['Isolated_Floating_Stone.png']
        },
        {
            requirements: ['Isolated_Standing_Grass_csv'],
            tiles: ['Isolated_Standing_Grass.png']
        },
        {
            requirements: ['Isolated_Deep_Stone_csv'],
            tiles: ['Isolated_Deep_Stone.png']
        },
        {
            requirements: ['Isolated_Bottom_Stone_csv'],
            tiles: ['Isolated_Bottom_Stone.png']
        },
        // {
        //     requirements: ['Isolated_Floating_Grass_csv'],
        //     tiles: ['Isolated_Floating_Grass.png'],
        // },
        {
            requirements: ['Isolated_Under_Stone_csv'],
            tiles: ['Isolated_Under_Stone.png'],
        }
    ]
    },
    '0': {
        type: null,
        variations: []
    },
}

function addObject(symbol, type, variations) {
    objectDictionary[symbol] = {
        type: type,
        variations: variations
    }
}

function getObject(symbol) {
    return objectDictionary[symbol]
}

function updateObject(symbol, key, value) {
    objectDictionary[symbol][key] = value
}

module.exports = { objectDictionary, addObject, getObject, updateObject };
