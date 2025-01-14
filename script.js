const generateForm = document.querySelector(".generate-form");
const imgGallery = document.querySelector(".img-gallery");
const OPENAI_API_KEY = "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";

const updateImgCard = (imgDataArray) =>{
    imgDataArray.forEach((imgObject,index) => {
        const imgCard = imgGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        //set the image src to ai generated image data
        const aiGeneratedImage = `data:image/jpeg;base64, ${imgObject.b64_json}`
        imgElement.src = aiGeneratedImage;

        //when img is loaded remove loading class
        imgElement.onload = () =>{
            imgCard.classList.remove("loading");
        }
    });
}


const generateAiTmages = async (userPrompt, userImgQuantity) => {
    if (!userPrompt || userImgQuantity <= 0) {
        alert("Please enter a valid prompt and quantity.");
        return;
    }
    try{
        //send request to open ai to generate images based on user input
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method:"POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            
            body: JSON.stringify(
                
                {
                model: "dall-e-3",
               prompt: userPrompt,
               n: parseInt(userImgQuantity),
              size: '512x512',
              response_format:'b64_json'
                
            }
        )
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try again...")

        const{ data } = await response.json(); //get data from response
        console.log(data);
        updateImgCard([...data]);
       

    }catch(error){
        alert(error.message);
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();
    
    //get user input and image quantity values
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;
    
    //create html markup for img card with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
    `<div class="img-card loading">
            <img src="images/loader.svg" alt="">
            <a href="#" class="download-btn">
                <img src="images/download.svg" alt="">
            </a>
        </div>`
    ).join("");

    imgGallery.innerHTML = imgCardMarkup;
    generateAiTmages(userPrompt, userImgQuantity)
}

generateForm.addEventListener("submit", handleFormSubmission);