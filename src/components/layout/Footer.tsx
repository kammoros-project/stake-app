import Container from "./Container";

function Footer() {
    return (
        <div className="bg-slate-900 text-white py-4 mt-32">
            <Container>
                <div>Built by <a href="https://b10k.io/" target={"_blank"} rel="noreferrer" className="hover:underline">[B10K.IO]</a></div>
            </Container>
        </div>
    )
}

export default Footer