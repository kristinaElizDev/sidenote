import { Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useQuery } from "@tanstack/react-query";
import TimelineItem from './timelineItem';


export type Note = {
    _id: number;
    title: string;
    body: string;
    date: Date;
}


const Timeline = () => {
    const {data:notes, isLoading} = useQuery<Note[]>({
        queryKey:["notes"],
        queryFn: async() => {
            try {
                const res = await fetch("http://localhost:4000/api/notes")
                const data = await res.json()

                if(!res.ok) {
                    throw new Error(data.error || "Something went wrong")
                }
                return data || []
            } catch (error) {
                console.log(error)
            }
        }
    });
    return (
        <>
            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"x1"} />
                </Flex>
            )}

            {!isLoading && notes?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"x1"} textAlign={"center"} color={"gray.500"}>
                        No notes found! 
                    </Text>
                    <img src='/go.png' alt='Go logo' width={70} height={70} />
                </Stack>
            )}
            <VerticalTimeline className="display-linebreak"
                layout="1-column-left"
            >
                {notes?.map((note) => (
                    <TimelineItem key={note._id} note={note} />
                ))}
            </VerticalTimeline>
        </>
    )
}

export default Timeline
