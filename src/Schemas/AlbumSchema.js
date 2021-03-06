const mongoose   = require('mongoose');
const { Schema } = mongoose;
const { PICDIR_PATH }   = '../serverConfig';

const album = new Schema({
    name: String,
    created_at: Date,
    capacity: Number,
    pics:[{
        path: { type:String, required: true },
        created_at: Date
      }
    ]
})

album.methods.configureServerPath = (pictureData) => {
  const { user_id, name, albumName } = pictureData;
  return `${PICDIR_PATH}/${user_id}/${albumName}/${name}`;
}

module.exports = mongoose.model('AlbumSchema', album);
