import express from 'express';
import Article from './../models/article';
import mongoose from 'mongoose';

const router = express.Router();
/*
 /home
 */
router.get('/', (req, res) => {
    console.log("처음이에요");
    Article.find({publish:true})
        .sort({"_id": -1})
        .limit(6)
        .exec((err, articles) => {
            if (err) throw err;
            res.json(articles);
        });
});

/*
 /home/:listType/:id
 */

router.get('/:listType/:id', (req, res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    // CHECK LIST TYPE VALIDITY
    if (listType !== 'old' && listType !== 'new') {
        return res.status(400).json({
            error: "INVALID LISTTYPE",
            code: 1
        });
    }

    // CHECK MEMO ID VALIDITY
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "INVALID ID",
            code: 2
        });
    }

    let objId = new mongoose.Types.ObjectId(req.params.id);

    if (listType === 'new') {
        // GET NEWER MEMO
        Article.find({$and:[{publish:true},{_id: {$gt: objId}}]})
            .sort({_id: -1})
            .limit(6)
            .exec((err, articles) => {
                if (err) throw err;
                return res.json(articles);
            });
    } else {
        // GET OLDER MEMO
        Article.find({$and:[{publish:true},{_id: {$lt: objId}}]})
            .sort({_id: -1})
            .limit(6)
            .exec((err, articles) => {
                if (err) throw err;
                return res.json(articles);
            });
    }
});
export default router;