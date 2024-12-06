
import Card from './Card'

const Cards = ({data}) => {
  return (
    <div className='grid grid-cols-2 gap-4 p-4 '>
        {data && data.features && data.features.map((item, index)=>{
            return <div className="" key={`item ${index}`}>
               <Card data={item}/>
            </div>
        })}
    </div>
  )
}

export default Cards