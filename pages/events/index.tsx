import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import MainLayout from "components/layouts/MainLayout"

const EventsPage = () => {
  const {cyfrUser} = useCyfrUserContext()

  return (
  <MainLayout sectionTitle="Events" >
    <div className="flex flex-col space-y-4">
      <div>
        <p>Get dem events.</p>
      </div>
    </div>
  </MainLayout>
)}

export default EventsPage
