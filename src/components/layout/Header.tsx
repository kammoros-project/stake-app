import Container from "./Container";
import logo from "../../assets/logo.png"
import ConnectButton from "../support/ConnectButton";

function Header() {
    return (
        <div className="bg-slate-900 text-white">
            <Container>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex flex-row items-center">
                        <img src={logo} alt="Kammoros logo" className="w-16"/>
                        <span className="uppercase hidden sm:block text-sm md:text-xl font-semibold">Kammoros Staking</span>
                    </div>
                    <div>
                        <ConnectButton />
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Header