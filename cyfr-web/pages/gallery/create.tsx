import LeftColumn from "../../components/containers/LeftColumn"
import DropzoneV2 from "../../components/forms/Dropzone"
import StaticLayout from "../../components/layouts/StaticLayout"

const GalleryCreatePage = () => {
    return (
        <StaticLayout sectionTitle="Create a Gallery!" >
            <DropzoneV2 limit={1} />
        </StaticLayout>
    )
}

export default GalleryCreatePage