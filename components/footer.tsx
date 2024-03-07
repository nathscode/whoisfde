export default function Footer() {
  return (
    <div className="text-white bg-[#3A454B] px-2 xl:px-46 pt-16 md:pt-24 pb-10">
      <div className="flex flex-col max-lg:gap-8 text-center text-lg lg:flex-row justify-between mb-16">
        <div>
          <div className="text-bold text-2xl mb-2">Company</div>
          <div>About us</div>
          <div>Check out the blog</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">Join Us</div>
          <div>Create an account</div>
          <div>Login to account</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">Useful links</div>
          <div>Land freight</div>
          <div>Sea shipping</div>
          <div>Air lifting</div>
        </div>
        <div>
          <div className="text-bold text-2xl mb-2">More information</div>
          <div>Terms & conditions</div>
          <div>Our privacy policy</div>
        </div>
      </div>
      <div className="text-center font-extralight">Copyright © 2024 Freights inc.</div>
    </div>
  );
}