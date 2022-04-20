const {Thought, User} = require('../models');

const thoughtsController = {

//create a new thought
createThoughts({params, body}, res) {
    Thought.create(body)
    .then(({_id}) => {
         return User.findOneAndUpdate({ _id: params.userId}, {$push: {thoughts: _id}}, {new: true});
     })
    .then(dbThoughtsData => {
         if(!dbThoughtsData) {
             return res.status(404).json({message: 'Unable to create a new thought'});
        }
         res.json(dbThoughtsData)
     })
        .catch(err => res.json(err)); 
    },

//pull all thoughts
 getAllThoughts(req,res) {
    Thought.find({})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => res.json(dbThoughtsData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
    },

//pull a thought by id
getThoughtsById({params}, res) {
    Thought.findOne({ _id: params.id })
    .populate({path: 'reactions',select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
         if(!dbThoughtsData) {
         res.status(404).json({message: 'No thought with that ID found'});
        return;
    }
        res.json(dbThoughtsData)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

//update a thought
updateThoughts({params, body}, res) {
    Thought.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-___v')
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
             res.status(404).json({message: 'unable to update thought'});
             return;
         }
             res.json(dbThoughtsData);
    })
        .catch(err => res.json(err));
    },

//delete a thought
deleteThoughts({params}, res) {
    Thought.findOneAndDelete({_id: params.id})
    .then(dbThoughtsData => {
         if (!dbThoughtsData) {
            res.status(404).json({message: 'unable to remove thought'});
             return;
        }
        res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err));
},

//add a reaction
 addReaction({params, body}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then(dbThoughtsData => {
    if (!dbThoughtsData) {
         res.status(404).json({message: "Unable to create a new reaction"});
        return;
    }
    res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err))

},

//remove a reaction
deleteReaction({params}, res) {
    Thought.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
    .then(dbThoughtsData => {
        if (!dbThoughtsData) {
             res.status(404).json({message: 'unable to remove reaction'});
             return;
        }
         res.json(dbThoughtsData);
    })
    .catch(err => res.status(400).json(err));
}

};

module.exports = thoughtsController;