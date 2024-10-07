import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    Textarea,
    Spinner,
    Input,
    Stack,
  } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { BASE_URL } from '../App'
import { IoMdAdd } from 'react-icons/io'


const NewNoteForm = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef(null)

    const [newNote, setNewNote] = useState("");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [isPending, setIsPending] = useState(false);
    
    const queryClient = useQueryClient(); 

    const {mutate:createNote,isPending:isCreating}=useMutation({
        mutationKey:['createNote'],
        mutationFn:async(e:React.FormEvent)=> {
            e.preventDefault()
            try {

                var payload = {
                  title: newNoteTitle, 
                  body: newNote
                }

                const res = await fetch(BASE_URL + `/notes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
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
    <>
      <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
        New Note
      </Button>
      <Drawer
        size='lg'
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create a New Note</DrawerHeader>

          <DrawerBody>
            <Stack gap='3'>
                <p>Note Title:</p>
                <Input
                        type='text'
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                />
                <p>Body:</p>
                <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    size='xs'
                />
              </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
                    mx={2}
                    type='submit'
                    colorScheme='blue'
                    _active={{
                        transform: "scale(.97)",
                    }}
                    onClick={createNote}
                >
                    {isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
                </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )

}

export default NewNoteForm;