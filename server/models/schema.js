const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { Schema, model } = mongoose;

const chatSchema = new Schema([
  {
    sender: { type: String, required: true },
    content: String,
    links: [
      {
        url: String, // default null
      },
    ],
    images: [
      {
        url: String, // default null
      },
    ],
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
]);

const linkSchema = new Schema([
  {
    sender: { type: String, required: true },
    content: String,
    links: [
      {
        url: { type: String, required: true },
      },
    ],
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
]);

const fileSchema = new Schema([
  {
    sender: { type: String, required: true },
    content: String, // default null
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    createdAt: {
      type: Date,
      immutable: true,
      default: () => Date.now(),
    },
  },
]);

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
      server: String, // 'AppWork School',
      userRoles: [String], // ['BackEnd', 'Teacher'],
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
  members: [String], // ['Howard', '小賴', '谷哥', 'Claudia']
  roles: [
    {
      title: [String], // ['BackEnd', 'Teacher']
      users: [String], // ['Howard', 'Adam', 'Kelvin'],
    },
  ],
  groups: [
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
              id: String, // Howard
              permission: String, // read
            },
          ],
          chatRecord: chatSchema,
          linksBlock: linkSchema,
          filesBlock: fileSchema,
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
