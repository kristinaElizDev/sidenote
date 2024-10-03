import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";

export type Todo = {
    _id: number;
    body: string;
    completed: boolean;
}


const TodoList = () => {
    const {data:todos, isLoading} = useQuery<Todo[]>({
        queryKey:["todos"],
        queryFn: async() => {
            try {
                const res = await fetch("http://localhost:4000/api/todos")
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
            <Text fontSize={"4x1"} textTransform={"uppercase"} fontWeight={"bold"} textAlign={"center"} my={2}>
                Today's Tasks
            </Text>
            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"x1"} />
                </Flex>
            )}
            {!isLoading && todos?.length === 0 && (
                <Stack alignItems={"center"} gap='3'>
                    <Text fontSize={"x1"} textAlign={"center"} color={"gray.500"}>
                        All tasks completed!
                    </Text>
                    <img src='/go.png' alt='Go logo' width={70} height={70} />
                </Stack>
            )}
            <Stack gap={3}>
                {todos?.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} />
                ))}
            </Stack>
        </>
    )
}
export default TodoList;