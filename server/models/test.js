const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const personalChatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String, // Can be null
  links: {
    linkURL: String, // Can be null
  },

  files: {
    fileURL: String, // Can be null
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

const multiChatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String, // Can be null
  links: {
    linkURL: String, // Can be null
  },
  files: {
    fileURL: String, // Can be null
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  password: {
    type: String,
    required: true,
  },
  outgoingFriendReq: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  incomingFriendReq: [
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
      userPermission: {
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
  serverName: String,
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  roles: [
    {
      // title: String, // 'Back-End'
      permission: String,
      usersId: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  ],
  channel: [
    {
      title: String, // 公佈欄
      isPublic: Boolean, // false
      // roles: [
      //   {
      //     roleName: String, // Back-end
      //     permission: String, // read
      //   },
      // ],
      members: [
        {
          _id: false,
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
          permission: String, // read (程式控制)
        },
      ],
      chatRecord: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MultiChat',
        },
      ],
      linksBlock: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MultiChat',
        },
      ],
      filesBlock: [
        {
          type: Schema.Types.ObjectId,
          ref: 'MultiChat',
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
const PersonalChat = model('PersonalChat', personalChatSchema);
const MultiChat = model('MultiChat', multiChatSchema);

module.exports = { User, Server, PersonalChat, MultiChat };
