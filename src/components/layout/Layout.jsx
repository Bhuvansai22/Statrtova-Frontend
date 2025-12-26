import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, showFooter = true }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    showFooter: PropTypes.bool,
};

export default Layout;
