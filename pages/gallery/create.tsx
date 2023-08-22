import GalleryCreateModal from "../../components/containers/Gallery/GalleryCreateModal"
import StaticLayout from "../../components/layouts/StaticLayout"

const GalleryCreatePage = (_props: any) => {
    return (
    <StaticLayout sectionTitle="Create a Gallery!" >
        <GalleryCreateModal limit={25} />
    </StaticLayout>
)}

export default GalleryCreatePage