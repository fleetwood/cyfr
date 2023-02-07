import GalleryCreateView from "../../components/containers/Gallery/GalleryCreateView"
import LeftColumn from "../../components/containers/LeftColumn"
import DropzoneV2 from "../../components/forms/Dropzone"
import StaticLayout from "../../components/layouts/StaticLayout"

const GalleryCreatePage = () => 
    <StaticLayout sectionTitle="Create a Gallery!" >
        <GalleryCreateView limit={5} />
    </StaticLayout>

export default GalleryCreatePage