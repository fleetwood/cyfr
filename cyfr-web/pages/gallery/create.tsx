import GalleryCreateView from "../../components/containers/Gallery/GalleryCreateView"
import StaticLayout from "../../components/layouts/StaticLayout"

const GalleryCreatePage = ({}) => 
    <StaticLayout sectionTitle="Create a Gallery!" >
        <GalleryCreateView limit={25} />
    </StaticLayout>

export default GalleryCreatePage