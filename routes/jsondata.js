const express=require('express');
const axios=require('axios');
const xl = require('excel4node');
const router = express.Router;
const cheerio = require('cheerio');
const app=express();
const wb = new xl.Workbook();
const ws = wb.addWorksheet('jsondata');



async function jsondata(){
    try{
        const siteUrl="https://en.wikipedia.org/wiki/List_of_most-visited_art_museums";
        const { data }=await axios({
            method: "GET",
            url:siteUrl,
        })
        const $=cheerio.load(data);
        const textselector='#mw-content-text > div.mw-parser-output > table > tbody > tr'

        const keys=[
            'N.',
            'Museum',
            'City',
            'Visitors annually',
            'Image',
        ]
        let artArray=[];

        $(textselector).each((index,element)=>{
            let keyIndex=0
            const artObj={}

            if(index<=10 && index>=1){
                // console.log(index);
                $(element).children().each((childindex,childelement)=>{
                    let value=$(childelement).text();

                    if(keyIndex==4){
                        value="Image URL"
                    }
                    if(value){
                        // console.log(value)
                        artObj[keys[keyIndex]]=value;
                        keyIndex++
                    }
                })
                if(artObj){
                    artArray.push(artObj);
                }
            }
            // return index;
        })
        return artArray
    }catch(err){
        console.log(err)
    }
}
router.get("/topart",async (req,res)=>{
    try{
        const toparts=await jsondata();

        return res.status(200).json({
            result:toparts,
        })
    }catch(err){
        return err
    }
})

module.exports=router
