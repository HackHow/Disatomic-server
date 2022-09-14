const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const chatSchema = new Schema([
  {
    sender: { type: String, required: true },
    content: String,
    links: [
      {
        url: String, // Can be null
      },
    ],
    files: [
      {
        url: String, // Can be null
      },
    ],
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
]);

// const linkSchema = new Schema([
//   {
//     sender: { type: String, required: true },
//     content: String,
//     links: [
//       {
//         url: { type: String, required: true },
//       },
//     ],
//     createdAt: {
//       type: Date,
//       immutable: true,
//       default: () => Date.now(),
//     },
//   },
// ]);

// const fileSchema = new Schema([
//   {
//     sender: { type: String, required: true },
//     content: String, // default null
//     images: [
//       {
//         url: { type: String, required: true },
//       },
//     ],
//     createdAt: {
//       type: Date,
//       immutable: true,
//       default: () => Date.now(),
//     },
//   },
// ]);

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    // test@test.com
    type: String,
    required: true,
  },
  password: {
    // ******
    type: String,
    required: true,
  },
  inviteFriends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  pendingFriends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  servers: [
    {
      _id: false,
      // server: String, // 'AppWork School',
      // userRoles: [String], // ['BackEnd', 'Teacher'],
      userRoles: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
      },
      serverId: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
      },
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const serverSchema = new Schema({
  serverName: String, // AppworkSchool
  members: [
    // ['Howard', '小賴', '谷哥', 'Claudia'] [object._id]
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  roles: [
    {
      title: String, // 'BackEnd'
      users: [
        {
          // ['Howard', 'Adam', 'Kelvin'],
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
  category: [
    {
      title: String, // BACK-END
      channel: [
        {
          title: String, // 公佈欄
          isPublic: Boolean, // false
          roles: [
            {
              roleName: String, // Back-end
              permission: String, // read
            },
          ],
          members: [
            {
              id: {
                // Howard
                type: Schema.Types.ObjectId,
                ref: 'User',
              },
              permission: String, // read (程式控制)
            },
          ],
          chatRecord: chatSchema,
          linksBlock: {
            type: Schema.Types.ObjectId,
            ref: 'Server',
          },
          filesBlock: {
            type: Schema.Types.ObjectId,
            ref: 'Server',
          },
          createdAt: {
            type: Date,
            immutable: true,
            default: () => Date.now(),
          },
          updatedAt: {
            type: Date,
            default: null,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const User = model('User', userSchema);
const Server = model('Server', serverSchema);

module.exports = { User, Server };
