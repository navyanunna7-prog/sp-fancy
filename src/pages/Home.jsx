import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function Home() {
  return (
    <main>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <p className="hero-label">
            WELCOME TO FANCY STORE
          </p>

          <h1>
            Style That
            <br />
            Shines.
          </h1>

          <p className="hero-text">
            Discover beautiful jewellery, stylish slippers,
            elegant handbags and accessories curated
            specially for you.
          </p>

          <Link to="/shop" className="primary-btn">
            SHOP NOW
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* =========================
          CATEGORY SECTION
      ========================= */}

      <section className="categories-section">

        <div className="section-heading">

          <div>
            <p className="section-label">
              EXPLORE OUR COLLECTION
            </p>

            <h2>
              Shop By Category
            </h2>
          </div>

          <Link
            to="/shop"
            className="view-all"
          >
            View All
            <ArrowRight size={17} />
          </Link>

        </div>


        <div className="category-grid">

          {/* JEWELLERY */}

          <Link
            to="/shop?category=jewellery"
            className="category-card"
          >

            <div className="category-image jewellery-image"></div>

            <div className="category-info">

              <h3>Jewellery</h3>

              <p>
                Elegant & timeless
              </p>

            </div>

          </Link>


          {/* SLIPPERS */}

          <Link
            to="/shop?category=slippers"
            className="category-card"
          >

            <div className="category-image slippers-image"></div>

            <div className="category-info">

              <h3>Slippers</h3>

              <p>
                Comfort meets style
              </p>

            </div>

          </Link>


          {/* HANDBAGS */}

          <Link
            to="/shop?category=handbags"
            className="category-card"
          >

            <div className="category-image handbags-image"></div>

            <div className="category-info">

              <h3>Handbags</h3>

              <p>
                Perfect for every look
              </p>

            </div>

          </Link>


          {/* ACCESSORIES */}

          <Link
            to="/shop?category=accessories"
            className="category-card"
          >

            <div className="category-image accessories-image"></div>

            <div className="category-info">

              <h3>Accessories</h3>

              <p>
                Complete your style
              </p>

            </div>

          </Link>

        </div>

      </section>


      {/* =========================
          COLLECTION BANNER
      ========================= */}

      <section className="collection-banner">

        <div className="collection-content">

          <div className="collection-icon">
            <Sparkles size={22} />
          </div>

          <p className="section-label">
            OUR LATEST COLLECTION
          </p>

          <h2>
            Little things
            <br />
            make you shine.
          </h2>

          <p>
            From statement jewellery to stylish slippers,
            discover pieces that add a special touch
            to your everyday look.
          </p>

          <Link
            to="/shop"
            className="secondary-btn"
          >
            EXPLORE COLLECTION
          </Link>

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="features">

        <div className="feature">

          <div className="feature-icon">
            <Truck size={25} />
          </div>

          <div>

            <h3>
              Fast Delivery
            </h3>

            <p>
              Quick delivery to your doorstep
            </p>

          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            <ShieldCheck size={25} />
          </div>

          <div>

            <h3>
              Secure Shopping
            </h3>

            <p>
              Safe and secure shopping experience
            </p>

          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">
            <RotateCcw size={25} />
          </div>

          <div>

            <h3>
              Easy Returns
            </h3>

            <p>
              Simple and hassle-free returns
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;