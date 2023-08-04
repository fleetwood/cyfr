import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import MainLayout from "components/layouts/MainLayout"

const GalleriesPage = () => {
  const {cyfrUser} = useCyfrUserContext()

  return (
  <MainLayout sectionTitle="Galleries" >
    <div className="flex flex-col space-y-4">
      <div>
        <p>Get dem galleries.</p>
      </div>
    </div>
  </MainLayout>
)}

export default GalleriesPage
