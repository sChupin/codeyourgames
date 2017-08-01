var fs = require('fs');
var path = require('path');
var doc = [
    {
        "tags": [
            {
                "tag": "class",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 6,
                "source": "@class Sprite"
            },
            {
                "tag": "private",
                "name": "",
                "optional": false,
                "type": "",
                "description": "",
                "line": 7,
                "source": "@private"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "x",
                "optional": false,
                "description": "Sprite horizontal position",
                "line": 9,
                "source": "@property {number} x Sprite horizontal position"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "y",
                "optional": false,
                "description": "Sprite vertical position",
                "line": 10,
                "source": "@property {number} y Sprite vertical position"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "width",
                "optional": false,
                "description": "Sprite width",
                "line": 11,
                "source": "@property {number} width Sprite width"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "height",
                "optional": false,
                "description": "Sprite height",
                "line": 12,
                "source": "@property {number} height Sprite height"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "angle",
                "optional": false,
                "description": "Sprite angle",
                "line": 13,
                "source": "@property {number} angle Sprite angle"
            }
        ],
        "line": 5,
        "description": "",
        "source": "@class Sprite\n@private\n\n@property {number} x Sprite horizontal position\n@property {number} y Sprite vertical position\n@property {number} width Sprite width\n@property {number} height Sprite height\n@property {number} angle Sprite angle"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "hide",
                "optional": false,
                "type": "",
                "description": "",
                "line": 71,
                "source": "@method hide"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 72,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 73,
                "source": "@memberof Sprite"
            }
        ],
        "line": 68,
        "description": "Set the sprite invisible",
        "source": "Set the sprite invisible\n\n@method hide\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "show",
                "optional": false,
                "type": "",
                "description": "",
                "line": 83,
                "source": "@method show"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 84,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 85,
                "source": "@memberof Sprite"
            }
        ],
        "line": 80,
        "description": "Set the sprite visible",
        "source": "Set the sprite visible\n\n@method show\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "moveUp",
                "optional": false,
                "type": "",
                "description": "",
                "line": 94,
                "source": "@method moveUp"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 95,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 96,
                "source": "@memberof Sprite"
            }
        ],
        "line": 91,
        "description": "Move the sprite one layer up",
        "source": "Move the sprite one layer up\n\n@method moveUp\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "moveDown",
                "optional": false,
                "type": "",
                "description": "",
                "line": 103,
                "source": "@method moveDown"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 104,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 105,
                "source": "@memberof Sprite"
            }
        ],
        "line": 100,
        "description": "Move the sprite one layer down",
        "source": "Move the sprite one layer down\n\n@method moveDown\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "sendToBack",
                "optional": false,
                "type": "",
                "description": "",
                "line": 112,
                "source": "@method sendToBack"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 113,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 114,
                "source": "@memberof Sprite"
            }
        ],
        "line": 109,
        "description": "Send the sprite to the lowest layer",
        "source": "Send the sprite to the lowest layer\n\n@method sendToBack\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "bringToTop",
                "optional": false,
                "type": "",
                "description": "",
                "line": 125,
                "source": "@method bringToTop"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 126,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Sprite",
                "optional": false,
                "type": "",
                "description": "",
                "line": 127,
                "source": "@memberof Sprite"
            }
        ],
        "line": 122,
        "description": "Bring the sprite to the highest layer",
        "source": "Bring the sprite to the highest layer\n\n@method bringToTop\n@return {void}\n@memberof Sprite"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Platformer",
                "optional": false,
                "type": "",
                "description": "",
                "line": 134,
                "source": "@class Platformer"
            },
            {
                "tag": "extends",
                "type": "Sprite",
                "name": "",
                "optional": false,
                "description": "",
                "line": 135,
                "source": "@extends {Sprite}"
            },
            {
                "tag": "private",
                "name": "",
                "optional": false,
                "type": "",
                "description": "",
                "line": 136,
                "source": "@private"
            }
        ],
        "line": 133,
        "description": "",
        "source": "@class Platformer\n@extends {Sprite}\n@private"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Hero",
                "optional": false,
                "type": "",
                "description": "",
                "line": 217,
                "source": "@class Hero"
            },
            {
                "tag": "extends",
                "type": "Platformer",
                "name": "",
                "optional": false,
                "description": "",
                "line": 218,
                "source": "@extends {Platformer}"
            },
            {
                "tag": "property",
                "type": "boolean",
                "name": "canFall",
                "optional": true,
                "default": "true",
                "description": "Allows hero to fall below the bottom border of the game",
                "line": 220,
                "source": "@property {boolean} [canFall=true] Allows hero to fall below the bottom border of the game"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "speed",
                "optional": true,
                "default": "200",
                "description": "Hero movement speed",
                "line": 221,
                "source": "@property {number} [speed=200] Hero movement speed"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "gravity",
                "optional": true,
                "default": "500",
                "description": "Gravity applied to the hero",
                "line": 222,
                "source": "@property {number} [gravity=500] Gravity applied to the hero"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "jumpForce",
                "optional": true,
                "default": "250",
                "description": "Hero jump force",
                "line": 223,
                "source": "@property {number} [jumpForce=250] Hero jump force"
            },
            {
                "tag": "event",
                "name": "isHit",
                "optional": false,
                "description": "Indicates whether the hero is hit by a bullet",
                "type": "",
                "line": 225,
                "source": "@event isHit Indicates whether the hero is hit by a bullet"
            },
            {
                "tag": "event",
                "name": "fell",
                "optional": false,
                "description": "Indicates whether the hero has fallen below the bottom border of the game",
                "type": "",
                "line": 226,
                "source": "@event fell Indicates whether the hero has fallen below the bottom border of the game"
            },
            {
                "tag": "event",
                "name": "touchEnemy",
                "optional": false,
                "description": "Indicates whether the hero is touching an Enemy",
                "type": "",
                "line": 227,
                "source": "@event touchEnemy Indicates whether the hero is touching an Enemy"
            }
        ],
        "line": 214,
        "description": "Main character of a platform game. It is controllable with the keyboard arrows.",
        "source": "Main character of a platform game. It is controllable with the keyboard arrows.\n\n@class Hero\n@extends {Platformer}\n\n@property {boolean} [canFall=true] Allows hero to fall below the bottom border of the game\n@property {number} [speed=200] Hero movement speed\n@property {number} [gravity=500] Gravity applied to the hero\n@property {number} [jumpForce=250] Hero jump force\n\n@event isHit Indicates whether the hero is hit by a bullet\n@event fell Indicates whether the hero has fallen below the bottom border of the game\n@event touchEnemy Indicates whether the hero is touching an Enemy"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "restart",
                "optional": false,
                "type": "",
                "description": "",
                "line": 349,
                "source": "@method restart"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 350,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Hero",
                "optional": false,
                "type": "",
                "description": "",
                "line": 351,
                "source": "@memberof Hero"
            }
        ],
        "line": 346,
        "description": "Reset the hero properties to its initial values: position, width, height, angle, costume, jumpForce, gravity and speed",
        "source": "Reset the hero properties to its initial values: position, width, height, angle, costume, jumpForce, gravity and speed\n\n@method restart\n@return {void}\n@memberof Hero"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "equipWeapon",
                "optional": false,
                "type": "",
                "description": "",
                "line": 382,
                "source": "@method equipWeapon"
            },
            {
                "tag": "param",
                "type": "Weapon",
                "name": "weapon",
                "optional": false,
                "description": "The weapon to equip",
                "line": 383,
                "source": "@param {Weapon} weapon The weapon to equip"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 384,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Hero",
                "optional": false,
                "type": "",
                "description": "",
                "line": 385,
                "source": "@memberof Hero"
            }
        ],
        "line": 379,
        "description": "Equip an existing weapon. Note: use fire() to use the equipped weapon",
        "source": "Equip an existing weapon. Note: use fire() to use the equipped weapon\n\n@method equipWeapon\n@param {Weapon} weapon The weapon to equip\n@return {void}\n@memberof Hero"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "fire",
                "optional": false,
                "type": "",
                "description": "",
                "line": 397,
                "source": "@method fire"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 398,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Hero",
                "optional": false,
                "type": "",
                "description": "",
                "line": 399,
                "source": "@memberof Hero"
            }
        ],
        "line": 394,
        "description": "Use the weapon equipped by the hero if any",
        "source": "Use the weapon equipped by the hero if any\n\n@method fire\n@return {void}\n@memberof Hero"
    },
    {
        "tags": [
            {
                "tag": "method",
                "name": "equipWeapon",
                "optional": false,
                "type": "",
                "description": "",
                "line": 410,
                "source": "@method equipWeapon"
            },
            {
                "tag": "return",
                "type": "void",
                "name": "",
                "optional": false,
                "description": "",
                "line": 411,
                "source": "@return {void}"
            },
            {
                "tag": "memberof",
                "name": "Hero",
                "optional": false,
                "type": "",
                "description": "",
                "line": 412,
                "source": "@memberof Hero"
            }
        ],
        "line": 407,
        "description": "Unequip the equipped weapon if any",
        "source": "Unequip the equipped weapon if any\n\n@method equipWeapon\n@return {void}\n@memberof Hero"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Platform",
                "optional": false,
                "type": "",
                "description": "",
                "line": 424,
                "source": "@class Platform"
            },
            {
                "tag": "extends",
                "type": "Sprite",
                "name": "",
                "optional": false,
                "description": "",
                "line": 425,
                "source": "@extends {Sprite}"
            },
            {
                "tag": "property",
                "type": "boolean",
                "name": "bottomBlocking",
                "optional": true,
                "default": "true",
                "description": "If false, a hero can jump on the platform from below",
                "line": 427,
                "source": "@property {boolean} [bottomBlocking=true] If false, a hero can jump on the platform from below"
            }
        ],
        "line": 421,
        "description": "Platform on which hero and enemies can stand",
        "source": "Platform on which hero and enemies can stand\n\n@class Platform\n@extends {Sprite}\n\n@property {boolean} [bottomBlocking=true] If false, a hero can jump on the platform from below"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Decor",
                "optional": false,
                "type": "",
                "description": "",
                "line": 460,
                "source": "@class Decor"
            },
            {
                "tag": "extends",
                "type": "Sprite",
                "name": "",
                "optional": false,
                "description": "",
                "line": 461,
                "source": "@extends {Sprite}"
            }
        ],
        "line": 457,
        "description": "An image that won't interact with other sprites. It is automatically set in the background.",
        "source": "An image that won't interact with other sprites. It is automatically set in the background.\n\n@class Decor\n@extends {Sprite}"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Enemy",
                "optional": false,
                "type": "",
                "description": "",
                "line": 475,
                "source": "@class Enemy"
            },
            {
                "tag": "extends",
                "type": "Platformer",
                "name": "",
                "optional": false,
                "description": "",
                "line": 476,
                "source": "@extends {Platformer}"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "speed",
                "optional": true,
                "default": "200",
                "description": "Enemy movement speed",
                "line": 478,
                "source": "@property {number} [speed=200] Enemy movement speed"
            },
            {
                "tag": "property",
                "type": "boolean",
                "name": "autoMove",
                "optional": true,
                "default": "true",
                "description": "Enable automatic motion of the enemy",
                "line": 479,
                "source": "@property {boolean} [autoMove=true] Enable automatic motion of the enemy"
            },
            {
                "tag": "event",
                "name": "isHit",
                "optional": false,
                "description": "Indicates whether the enemy is hit by a bullet",
                "type": "",
                "line": 481,
                "source": "@event isHit Indicates whether the enemy is hit by a bullet"
            }
        ],
        "line": 472,
        "description": "Platform ennemy that automatically walks on platforms",
        "source": "Platform ennemy that automatically walks on platforms\n\n@class Enemy\n@extends {Platformer}\n\n@property {number} [speed=200] Enemy movement speed\n@property {boolean} [autoMove=true] Enable automatic motion of the enemy\n\n@event isHit Indicates whether the enemy is hit by a bullet"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Spaceship",
                "optional": false,
                "type": "",
                "description": "",
                "line": 557,
                "source": "@class Spaceship"
            },
            {
                "tag": "extends",
                "type": "Sprite",
                "name": "",
                "optional": false,
                "description": "",
                "line": 558,
                "source": "@extends {Sprite}"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "speed",
                "optional": true,
                "default": "250",
                "description": "Spaceship movement speed",
                "line": 560,
                "source": "@property {number} [speed=250] Spaceship movement speed"
            },
            {
                "tag": "event",
                "name": "isHit",
                "optional": false,
                "description": "Indicates whether the spaceship is hit by a bullet",
                "type": "",
                "line": 562,
                "source": "@event isHit Indicates whether the spaceship is hit by a bullet"
            }
        ],
        "line": 554,
        "description": "Main character of a space game. It is controllable with the keyboard arrows",
        "source": "Main character of a space game. It is controllable with the keyboard arrows\n\n@class Spaceship\n@extends {Sprite}\n\n@property {number} [speed=250] Spaceship movement speed\n\n@event isHit Indicates whether the spaceship is hit by a bullet"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Weapon",
                "optional": false,
                "type": "",
                "description": "",
                "line": 651,
                "source": "@class Weapon"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "width",
                "optional": false,
                "description": "Bullets width",
                "line": 653,
                "source": "@property {number} width Bullets width"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "height",
                "optional": false,
                "description": "Bullets height",
                "line": 654,
                "source": "@property {number} height Bullets height"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "angle",
                "optional": true,
                "default": "0",
                "description": "Bullets image orientation",
                "line": 655,
                "source": "@property {number} [angle=0]  Bullets image orientation"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "fireAngle",
                "optional": true,
                "default": "Angle.UP",
                "description": "Direction toward which the bullets are fired. It will be updated automatically if equipped by a Hero.",
                "line": 656,
                "source": "@property {number} [fireAngle=Angle.UP] Direction toward which the bullets are fired. It will be updated automatically if equipped by a Hero."
            },
            {
                "tag": "property",
                "type": "number",
                "name": "fireRate",
                "optional": true,
                "default": "200",
                "description": "Time in ms between two shots when the weapon fires continuously.",
                "line": 657,
                "source": "@property {number} [fireRate=200] Time in ms between two shots when the weapon fires continuously."
            },
            {
                "tag": "property",
                "type": "number",
                "name": "bulletSpeed",
                "optional": true,
                "default": "300",
                "description": "Bullets flying speed in px/s",
                "line": 658,
                "source": "@property {number} [bulletSpeed=300] Bullets flying speed in px/s"
            }
        ],
        "line": 648,
        "description": "Represents the bullet this weapon can shoot. A weapon cannot be directly add to the game but can be equipped by some types of sprite.",
        "source": "Represents the bullet this weapon can shoot. A weapon cannot be directly add to the game but can be equipped by some types of sprite.\n\n@class Weapon\n\n@property {number} width Bullets width\n@property {number} height Bullets height\n@property {number} [angle=0]  Bullets image orientation\n@property {number} [fireAngle=Angle.UP] Direction toward which the bullets are fired. It will be updated automatically if equipped by a Hero.\n@property {number} [fireRate=200] Time in ms between two shots when the weapon fires continuously.\n@property {number} [bulletSpeed=300] Bullets flying speed in px/s"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Text",
                "optional": false,
                "type": "",
                "description": "",
                "line": 753,
                "source": "@class Text"
            },
            {
                "tag": "property",
                "type": "string",
                "name": "text",
                "optional": false,
                "description": "The text to display",
                "line": 755,
                "source": "@property {string} text The text to display"
            },
            {
                "tag": "property",
                "type": "string",
                "name": "color",
                "optional": true,
                "default": "Color.Black",
                "description": "Text color",
                "line": 756,
                "source": "@property {string} [color=Color.Black] Text color"
            },
            {
                "tag": "property",
                "type": "number",
                "name": "fontSize",
                "optional": true,
                "default": "32",
                "description": "Text font size",
                "line": 757,
                "source": "@property {number} [fontSize=32] Text font size"
            },
            {
                "tag": "property",
                "type": "boolean",
                "name": "italic",
                "optional": true,
                "default": "false",
                "description": "Whether the text is in italic",
                "line": 758,
                "source": "@property {boolean} [italic=false] Whether the text is in italic"
            },
            {
                "tag": "property",
                "type": "boolean",
                "name": "bold",
                "optional": true,
                "default": "true",
                "description": "Whether the text is in bold",
                "line": 759,
                "source": "@property {boolean} [bold=true] Whether the text is in bold"
            }
        ],
        "line": 750,
        "description": "Editable text",
        "source": "Editable text\n\n@class Text\n\n@property {string} text The text to display\n@property {string} [color=Color.Black] Text color\n@property {number} [fontSize=32] Text font size\n@property {boolean} [italic=false] Whether the text is in italic\n@property {boolean} [bold=true] Whether the text is in bold"
    },
    {
        "tags": [
            {
                "tag": "class",
                "name": "Object",
                "optional": false,
                "type": "",
                "description": "",
                "line": 796,
                "source": "@class Object"
            },
            {
                "tag": "extends",
                "type": "Sprite",
                "name": "",
                "optional": false,
                "description": "",
                "line": 797,
                "source": "@extends {Sprite}"
            }
        ],
        "line": 793,
        "description": "An object can interact with all type of sprite.",
        "source": "An object can interact with all type of sprite.\n\n@class Object\n@extends {Sprite}"
    }
];
function parseDoc(doc) {
    var spriteTypes = {};
    doc.forEach(function (comment) {
        var tags = comment.tags;
        // Check if it's a class comment
        var classTag = tags.find(function (tagLine) { return tagLine.tag == 'class'; });
        if (classTag) {
            var spriteTypeName = classTag.name;
            // Set SpriteType name and description
            var spriteType_1 = { name: spriteTypeName, descr: comment.description, private: false, properties: [], events: [], methods: [] };
            spriteTypes[spriteTypeName] = spriteType_1;
            // Fill SpriteType properties and events
            tags.forEach(function (tag) {
                if (tag.tag == 'property') {
                    var property = { name: tag.name, type: tag.type, descr: tag.description, defVal: tag["default"] };
                    spriteType_1.properties.push(property);
                }
                else if (tag.tag == 'event') {
                    var event_1 = { name: tag.name, descr: tag.description };
                    spriteType_1.events.push(event_1);
                }
                else if (tag.tag == 'private') {
                    spriteType_1.private = true;
                }
            });
        }
        else {
            // It's a method comment
            var className = tags.find(function (tagLine) { return tagLine.tag == 'memberof'; }).name;
            var method_1 = { name: '', descr: comment.description, params: [], "return": { type: '', descr: '' } };
            tags.forEach(function (tag) {
                switch (tag.tag) {
                    case 'method':
                        method_1.name = tag.name;
                        break;
                    case 'return':
                        method_1["return"].type = tag.type;
                        method_1["return"].descr = tag.description;
                        break;
                    case 'param':
                        method_1.params.push({ name: tag.name, type: tag.type, descr: tag.description });
                        break;
                    default:
                        break;
                }
            });
            spriteTypes[className].methods.push(method_1);
        }
    });
    var spriteTypesArray = [];
    // for (let key in spriteTypes) {
    //   spriteTypesArray.push(spriteTypes[key]);
    // }
    return spriteTypes;
}
var jsonDoc = parseDoc(doc);
fs.writeFileSync(path.join(__dirname, 'jsonDoc.json'), JSON.stringify(parseDoc(doc), null, 2));
