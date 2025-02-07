import {Agent , Task , Team} from "kaibanjs" //package js utilisé pour créer des agents IA , des tâches et des équipes
import {TavilySearchResults} from "@langchain/community/tools/tavily_search" //est un outil qui va aller intérroger l'api tavilySearch et retourner un json
//tavily est un moteur de recherche temps réel permettant dux agent IA de récuperer des informations sur le net
import { NextResponse } from "next/server"  //fonction de next/server pour créer des réponses http


//1 définition de l'outil auquel l'agent aura accès
const searchTool = new TavilySearchResults ({
    maxResults : 5,
    apiKey : process.env.TAVILY_API_KEY
})


//2 create researchAgent (the first agent of our team)
const researchAgent = new  Agent({
    name : "Adam",
    role : "New Researcher",
    goal : "Find and summarize the latest news on a given topic",
    background : "Experienced in data analysis and information gathering",
    tools : [searchTool],
    llmConfig : {
        provider : "google",
        model : "gemini-1.5-flash-latest",
        apiKey : process.env.GOOGLE_API_KEY
    }
}) 


const writerAgent = new  Agent({
    name : "kai",
    role : "Content Creator",
    goal : "Create engaging blog posts based on provided information",
    background : "Skilled in writing and content creation",
    llmConfig : {
        provider : "google",
        model : "gemini-1.5-flash-latest",
        apiKey : process.env.GOOGLE_API_KEY
    }
}) 


const researchTask = new Task ({
     title : "Latest news research",
     description : "Research the latest news on the topic : {topic} ",
     expectedOutput :
        "A summary of the latest news and key points on the given topic ",
    agent : researchAgent
})

const writingTask = new Task ({
     title : "Blog post writing",
     description : "write a blog post about {topic} based on the provided research ",
     expectedOutput : 
        "A engaging blog post summarizing the latest news on the topic in markdown format",
    agent : writerAgent
})

const blogTeam = new Team({
    name : "AI News Blogging Team",
    agents : [researchAgent, writerAgent],
    tasks : [researchTask, writingTask]
})

export async function GET(req) {
    try {
        const { searchParams} = new URL(req.url);

        let topic = searchParams.get("topic") || "llm and ai"

        const output = await blogTeam.start({ topic })


        if (output.status === "FINISHED" /* check kaiban js state management status */ ) {
                return NextResponse.json ({
                    output : output.result
                })
        } else {
            
            return NextResponse.json({
                status : "FAILED",
                message : "Unable to generate blog post"
            })
        }

    } catch (error) {
        console.error("Error iun GET function: ", error);

        return NextResponse.json({
            status : "ERROR",
            message : error.toString()
        })
    }
}