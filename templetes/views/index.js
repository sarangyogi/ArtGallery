let category=document.getElementsByClassName("categories");
// let right=document.getElementById("right");
let right=document.getElementsByClassName("right");


// console.log(category[0]);
// console.log(right[0]);
let description=[
    {
        heading:"Antique Paintings",
        img:"assets/Antique/1.jpg",
        desc:"The oldest known paintings were created by our early ancestors, some 40,000 years ago. These first creations took the form of simple cave paintings, which were crafted onto rocky walls using black pigment and red ochre.Although these ancient cave paintings are rudimentary in style, they reveal a surprising level of naturalistic detail. At the Grotte Chauvet in France, for example, which boasts the oldest extant cave paintings in the world, individual animals can be distinguished, including lions, buffalos, mammoths and rhinoceroses, in addition to abstract design and geometric patterns.",
    },
    {
        heading:"Black And White Paintings",
        img:"assets/BlackAndWhite/1.jpeg",
        desc:"From the 15th century onward artists made painted studies in black and white to work through challenges posed by their subjects and compositions. Eliminating colour allows artists to concentrate on the way light and shadow fall across the surface of a figure, object or scene before committing to a full-colour canvas. ",
    },
    {
        heading:"Indian Tradition",
        img:"assets/IndianTradition/1.jpeg",
        desc:"One of the most celebrated styles of folk paintings in India is, Madhubani which originated in the Mithila region of Bihar as a form of wall art.This spectacular art style was unknown to the outside world until discovered by the British colonial William G. Archer in 1934 while inspecting the damage after the massive Bihar earthquake. Archer was amazed by the beautiful illustrations on the exposed interior walls of the houses...The beauty of Madhubani lies in its simple and evocative portrayal of culture and traditions. The designs are characterised by eye-catching geometrical patterns, symbolic images, and scenes from mythology. The balance between the vibrancy of colors and simplicity in its patterns make Madhubani different from other painting styles. Bharni, Katchni, Tantrik, Godna, and Kohbar are the five distinct styles of Madhubani painting.",
    },
    {
        heading:"Paintings",
        img:"assets/Paintings/1.jpg",
        desc:"A painting is an image (artwork) created using pigments (color) on a surface (ground) such as paper or canvas. The pigment may be in a wet form, such as paint, or a dry form, such as pastels. Painting can also be a verb, the action of creating such an artwork.",
    },
    {
        heading:"Fine Art",
        img:"assets/FineArts/1.jpg",
        desc:"fine art is a visual art considered to have been created primarily for aesthetic and intellectual purposes and judged for its beauty and meaningfulness, specifically, painting, sculpture, drawing, watercolor, graphics, and architecture. In that sense, there are conceptual differences between the fine arts and the decorative arts or applied arts (these two terms covering largely the same media). As far as the consumer of the art was concerned, the perception of aesthetic qualities required a refined judgment usually referred to as having good taste, which differentiated fine art from popular art and entertainment.",
    },
    {
        heading:"Colourful",
        img:"assets/Colourful/1.jpeg",
        desc:"Color, made up of hue, saturation, and value, dispersed over a surface is the essence of painting, just as pitch and rhythm are the essence of music. Color is highly subjective, but has observable psychological effects, although these can differ from one culture to the next. Black is associated with mourning in the West, but in the East, white is. Some painters, theoreticians, writers, and scientists",
    },
    {
        heading:"Decorative Art",
        img:"assets/Decorative/1.jpg",
        desc:"The decorative arts are arts or crafts whose object is the design and manufacture of objects that are both beautiful and functional. It includes most of the arts making objects for the interiors of buildings, and interior design, but not usually architecture. Ceramic art, metalwork, furniture, jewellery, fashion, various forms of the textile arts and glassware are major groupings.",
    }
];

for(let i=0;i<category.length;i++){
    // console.log(category.length);
    category[i].addEventListener("click",()=>{
        right[0].innerHTML=`<h1>${description[i].heading}</h1><img src=${description[i].img} class="homeimg" />
        <div class="homedesc">${description[i].desc}</div>`;
        console.log("clicked",i);
    });
}

const num=Math.floor(Math.random() * 10);
// document.cookie="Welcome to Art Gallery!";
// const k=document.cookie;
try{
    window.alert(`Hello! Welcome to Art Gallery!  Your Lucky Number is: ${num}`);
    // window.open(`Hello! Welcome to Art Gallery!  Your Lucky Number is: ${num}`);
}
catch(error){
    window.alert("An Error Occured to Open this Page!");
}

const openwindow=()=>{
    window.open("https://en.wikipedia.org/wiki/Art_gallery","","width:400,height:400");
}
