import { Account, Client, Databases, ID, Query } from "react-native-appwrite";
import Snackbar from 'react-native-snackbar';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;
//give permissions in appwrite collection -> any one can CRUD
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client)
const database = new Databases(client);

type createUserAccount = {
  email:string,
  password:string,
  name:string
}

type loginUserAccount = {
  email:string,
  password:string
}

export const createAccount = async({email,password,name}:createUserAccount)=>{
    try{
        const userAccount = await account.create(
          ID.unique(),
          email,
          password,
          name
        )
        return {success:true}
    }catch(err){
      console.log(err)
      return {error:err.message}
    }
}

export const login = async({email,password}:loginUserAccount)=>{
  try{
     await account.createEmailPasswordSession(email,password)
     return {success:true}

  }catch(err:any){
    console.log(err.message)
    return {error:err.message}
  }
}

export const getCurrentUser = async()=>{
  try{
    const res = await account.get()
    return {user:res,success:true}
  }catch(error){
    console.log(error)
    return {error:err.message}

  }
}

export const logout = async()=>{
  try{
    return account.deleteSession('current')
  }catch(error){
    console.log(error)
  }
}

// track the searches by user
export const updateSearchCount = async (query: string, movie: Movie) =>{
    try{
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('searchTerm',query)
           ])
        
           // check if the result of the search is already stored in the database
           if(result.documents.length>0){
             const existingMovie = result.documents[0]
             await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count:existingMovie.count+1
                }
             )
           }else{
             await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: query,
                    movie_id: movie.id,
                    title: movie.title,
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
             )
           }
    }catch(error){
        console.log("Error updating search count:", error);
        throw error;
    }
   
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async(userId,movie)=>{
  try{
    const movieData = JSON.stringify({
      movie_id: movie.id,
      title: movie.title,
      poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    })

    const existingUser = await database.listDocuments(DATABASE_ID,SAVED_COLLECTION_ID,[
      Query.equal("user_id",userId)
    ])
    if(existingUser.documents.length==0){
      const newDoc = await database.createDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        ID.unique(),
        {
            user_id: userId,
            saved_movies:[movieData]
        }
     )
     return {success:true,newDoc}
    }else{
      const userDoc = existingUser.documents[0]
      const savedMovies =   Array.isArray(userDoc.saved_movies) ? userDoc.saved_movies : [];
      
      // Check if the movie already exists in the saved_movies array
      const movieExists = savedMovies.some((item) => {
        const parsedItem = JSON.parse(item);
        return parsedItem.movie_id === movie.id;
      });

      if (movieExists) {
        return { success: false, message: "Movie already saved" };
      }

      savedMovies.push(movieData)
      const newDoc = await database.updateDocument(DATABASE_ID,SAVED_COLLECTION_ID,userDoc.$id,{
        saved_movies:savedMovies
      })
      return {success:true,newDoc}
    }

    
  }catch(err){
      console.log(err)
  }
}

export const fetchSavedMovies = async(userId)=>{
  try{
    const existingUser = await database.listDocuments(DATABASE_ID,SAVED_COLLECTION_ID,[
      Query.equal("user_id",userId)
    ])
    if (existingUser.documents.length === 0) return [];

    // Access the saved_movies array
    let savedMovies = existingUser.documents[0]?.saved_movies || [];
    console.log(savedMovies)

    // Parse each movie string into an object
    savedMovies = savedMovies.map((item) => JSON.parse(item));

    return savedMovies;
  }catch(err){
    console.log(err)
  }
}


