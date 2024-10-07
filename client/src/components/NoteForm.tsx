import { Flex, Textarea, Button, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";

const NoteForm = () => {
    const [newNote, setNewNote] = useState("");
    const [isPending, setIsPending] = useState(false);
    
    const queryClient = useQueryClient(); 

    const {mutate:createNote,isPending:isCreating}=useMutation({
        mutationKey:['createNote'],
        mutationFn:async(e:React.FormEvent)=> {
            e.preventDefault()
            try {
                const res = await fetch(BASE_URL + `/notes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ body: newNote }),
                })
                const data = await res.json()

                if(!res.ok) {
                    throw new  Error(data.error || "Something went wrong");
                }

                setNewNote("");
                return data;

            } catch (error: any) {
                console.log(error)
            }
        }, 
        onSuccess: () => { 
            queryClient.invalidateQueries({queryKey: ["notes"]});
        },
        onError: (error: any) => {
            alert(error.message);
        }
    });

    return (
        <form onSubmit={createNote}>
                <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    size='lg'
                />
                <Button
                    mx={2}
                    type='submit'
                    _active={{
                        transform: "scale(.97)",
                    }}
                >
                    {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
                </Button>
        </form>
    );
};
export default NoteForm