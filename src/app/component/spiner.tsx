import { DotLoader } from "react-spinners";

export default function Spinner() {
    return (
        <div className="absolute inset-0 flex justify-center items-center">
            <DotLoader size={30} color="#2b7fff" />
        </div>
    );
}