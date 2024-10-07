import { VerticalTimelineElement } from "react-vertical-timeline-component";
import { Note } from "./timeline";

const TimelineItem = ({ note } : {note: Note }) => {
    // const queryClient = useQueryClient();

    // const {mutate:updateNote,isPending:isUpdating} = useMutation({
    //     mutationKey:["updateNote"],
    //     mutationFn:async()=>{
    //             try {
    //                 const res = await fetch(BASE_URL + `/notes/${note._id}`, {
    //                     method:"PUT", 

    //                 })
    //                 const data = await res.json()
    //                 if (!res.ok) {
    //                     throw new Error(data.error || "Something went wrong");
    //                 }
    //                 return data
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }, onSuccess: () => {
    //         queryClient.invalidateQueries({queryKey: ["notes"]});
    //     }
    // });

    // const { mutate: deleteNote, isPending: isDeleting } =  useMutation({
    //     mutationKey:['deleteNote'],
    //     mutationFn:async() => {
    //         try {
    //             const res = await fetch(BASE_URL + `/notes/${note._id}`, {
    //                 method: "DELETE"
    //             });
                
    //             const data = await res.json();
    //             if (!res.ok) {
    //                 throw new Error(data.error || "Something went wrong")
    //             }
    //             return data;
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }, onSuccess: () =>  {
    //         queryClient.invalidateQueries({queryKey: ["notes"]});
    //     }
    // });

    return (
        <VerticalTimelineElement
            className="vertical-timeline-element--note"
            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date={note.date.toLocaleString()}
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
            icon={""}
        >
        <h3 className="vertical-timeline-element-title">{note.title ? note.title : "New Note"} </h3>
        <p>
        {note.body}
        </p>
    </VerticalTimelineElement>
    );
};
export default TimelineItem;