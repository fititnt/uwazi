import React, {Component} from 'react';
import {connect} from 'react-redux';

export class zorlakayHomepage extends Component {

  render() {
    return (
      <div className="zorlakay-homepage">
        <div className="hero-img">
          <b>Zorla Kaybedilenler Veritabanı</b>
          <img src="/public/zorlakay-logo-light.png" />
        </div>
        <div className="container">
          <div className="introduction">
            <div>
              <p>Hakikat Adalet Hafıza Merkezi tarafından hazırlanan bu veritabanında 12 Eylül 1980 askeri
                darbesinden sonra Türkiye’de zorla kaybedilenlerin verilerinin toplanması amaçlanıyor.
                Bu veritabanında kaybedilenlerin kişisel bilgileri, kaybedilme tarihi ve yerleri, kaybedilme öyküleri,
                kayıp olayına ilişkin hukuki veriler ve suçun şüphelileri yer alıyor.</p>
              <p>Veritabanı, 12 Eylül 1980 askeri darbesinden sonra kaybedilenlerin tümünü henüz kapsamıyor.
                Amacımız zaman içinde bu çalışmanın tüm zorla kaybedilenlerin verilerini içerecek şekilde tamamlanması.</p>
            </div>
            <ul>
              <li> <i className="fa fa-angle-right"></i> About the database</li>
              <li> <i className="fa fa-angle-right"></i> Methodology</li>
              <li> <i className="fa fa-angle-right"></i> How to navigate in the database</li>
              <li> <i className="fa fa-angle-right"></i> Take Action</li>
            </ul>
          </div>

          <h2>
            <span>Who is lost?</span>
            <div>
              <i className="slider-btn fa fa-angle-left"></i>
              <i className="slider-btn fa fa-angle-right"></i>
            </div>
          </h2>

          <div className="videos">
            <div className="video">
              <div className="victim-details">
                <div className="img"></div>
                <div>
                  <h1>İsmail Ağaya</h1>
                  <p>Age 20, Newspaper Distributor</p>
                </div>
                <div>
                  <p>
                    <i className="fa fa-circle"></i> <span>Status:</span> Investigation continues
                  </p>
                  <p>
                    <span>Lost location:</span> <a href="#"> <i className="fa fa-map-marker"></i> Batman</a>
                  </p>
                  <p>
                    <span>Lost date:</span> 1994-05-28
                  </p>
                  <p>
                    <span>Other people who lost together:</span><br />
                    <a href="#"><i className="fa fa-user-o"></i> Abdurrahman İbin</a>, <a href="#"><i className="fa fa-user-o"></i> Celal Yanık</a>
                  </p>
                </div>
                <div>
                  <a href="#">
                    <i className="fa fa-file-text-o"></i> View report
                  </a>
                  <a href="#">
                    <i className="fa fa-file-video-o"></i> Testimonial
                  </a>
                </div>
              </div>
            </div>
            <div className="video">
              <div className="victim-details">
                <div className="img"></div>
                <div>
                  <h1>İsmail Ağaya</h1>
                  <p>Age 20, Newspaper Distributor</p>
                </div>
                <div>
                  <p>
                    <i className="fa fa-circle"></i> <span>Status:</span> Investigation continues
                  </p>
                  <p>
                    <span>Lost location:</span> <a href="#"> <i className="fa fa-map-marker"></i> Batman</a>
                  </p>
                  <p>
                    <span>Lost date:</span> 1994-05-28
                  </p>
                  <p>
                    <span>Other people who lost together:</span><br />
                    <a href="#"><i className="fa fa-user-o"></i> Abdurrahman İbin</a>, <a href="#"><i className="fa fa-user-o"></i> Celal Yanık</a>
                  </p>
                </div>
                <div>
                  <a href="#">
                    <i className="fa fa-file-text-o"></i> View report
                  </a>
                  <a href="#">
                    <i className="fa fa-file-video-o"></i> Testimonial
                  </a>
                </div>
              </div>
            </div>
            <div className="video">
              <div className="victim-details">
                <div className="img"></div>
                <div>
                  <h1>İsmail Ağaya</h1>
                  <p>Age 20, Newspaper Distributor</p>
                </div>
                <div>
                  <p>
                    <i className="fa fa-circle"></i> <span>Status:</span> Investigation continues
                  </p>
                  <p>
                    <span>Lost location:</span> <a href="#"> <i className="fa fa-map-marker"></i> Batman</a>
                  </p>
                  <p>
                    <span>Lost date:</span> 1994-05-28
                  </p>
                  <p>
                    <span>Other people who lost together:</span><br />
                    <a href="#"><i className="fa fa-user-o"></i> Abdurrahman İbin</a>, <a href="#"><i className="fa fa-user-o"></i> Celal Yanık</a>
                  </p>
                </div>
                <div>
                  <a href="#">
                    <i className="fa fa-file-text-o"></i> View report
                  </a>
                  <a href="#">
                    <i className="fa fa-file-video-o"></i> Testimonial
                  </a>
                </div>
              </div>
            </div>
            <div className="video">
              <div className="victim-details">
                <div className="img"></div>
                <div>
                  <h1>İsmail Ağaya</h1>
                  <p>Age 20, Newspaper Distributor</p>
                </div>
                <div>
                  <p>
                    <i className="fa fa-circle"></i> <span>Status:</span> Investigation continues
                  </p>
                  <p>
                    <span>Lost location:</span> <a href="#"> <i className="fa fa-map-marker"></i> Batman</a>
                  </p>
                  <p>
                    <span>Lost date:</span> 1994-05-28
                  </p>
                  <p>
                    <span>Other people who lost together:</span><br />
                    <a href="#"><i className="fa fa-user-o"></i> Abdurrahman İbin</a>, <a href="#"><i className="fa fa-user-o"></i> Celal Yanık</a>
                  </p>
                </div>
                <div>
                  <a href="#">
                    <i className="fa fa-file-text-o"></i> View report
                  </a>
                  <a href="#">
                    <i className="fa fa-file-video-o"></i> Testimonial
                  </a>
                </div>
              </div>
            </div>
            <div className="video">
              <div className="victim-details">
                <div className="img"></div>
                <div>
                  <h1>İsmail Ağaya</h1>
                  <p>Age 20, Newspaper Distributor</p>
                </div>
                <div>
                  <p>
                    <i className="fa fa-circle"></i> <span>Status:</span> Investigation continues
                  </p>
                  <p>
                    <span>Lost location:</span> <a href="#"> <i className="fa fa-map-marker"></i> Batman</a>
                  </p>
                  <p>
                    <span>Lost date:</span> 1994-05-28
                  </p>
                  <p>
                    <span>Other people who lost together:</span><br />
                    <a href="#"><i className="fa fa-user-o"></i> Abdurrahman İbin</a>, <a href="#"><i className="fa fa-user-o"></i> Celal Yanık</a>
                  </p>
                </div>
                <div>
                  <a href="#">
                    <i className="fa fa-file-text-o"></i> View report
                  </a>
                  <a href="#">
                    <i className="fa fa-file-video-o"></i> Testimonial
                  </a>
                </div>
              </div>
            </div>
          </div>

          <a href="#" className="btn btn-default btn-lg">
            <i className="fa fa-search"></i> All 500 victims
          </a>

          <h2>
            <span>Testimonials</span>
            <div>
              <i className="slider-btn fa fa-angle-left"></i>
              <i className="slider-btn fa fa-angle-right"></i>
            </div>
          </h2>
          <div className="videos">
            <div className="video">
              <div>
                <iframe src="https://player.vimeo.com/video/68836138"
                width="284" height="165" frameBorder="0" allowFullScreen></iframe>
                <h3>İhsan Arslan (Şırnak-Cizre, 1993)</h3>
                <p>1993 yılında Şırnak-Cizre'de zorla kaybedilen İhsan Arslan'ın eşi Şevkiye Arslan ile yapılan görüşme.</p>
              </div>
              <a className="btn-action" href="#">
                <i className="fa fa-file-text-o"></i> View report
              </a>
            </div>
            <div className="video">
              <div>
                <iframe src="https://player.vimeo.com/video/68836138"
                width="284" height="165" frameBorder="0" allowFullScreen></iframe>
                <h3>İhsan Arslan (Şırnak-Cizre, 1993)</h3>
                <p>1993 yılında Şırnak-Cizre'de zorla kaybedilen İhsan Arslan'ın eşi Şevkiye Arslan ile yapılan görüşme.</p>
              </div>
              <a className="btn-action" href="#">
                <i className="fa fa-file-text-o"></i> View report
              </a>
            </div>
            <div className="video">
              <div>
                <iframe src="https://player.vimeo.com/video/157129383"
                  width="284" height="165" frameBorder="0" allowFullScreen></iframe>
                <h3>Abdullah Duskun (Şırnak-Cizre, 1994)</h3>
                <p>1994 yılında Şırnak'ın Cizre ilçesinde kaybedilen Abdullah Düşkün ile ilgili Abdullah Düşkün'ün eşi Hediye Düşkün ile görüşme</p>
              </div>
              <a className="btn-action" href="#">
                <i className="fa fa-file-text-o"></i> View report
              </a>
            </div>
            <div className="video">
              <div>
                <iframe src="https://player.vimeo.com/video/161483268"
                  width="284" height="165" frameBorder="0" allowFullScreen></iframe>
                <h3>İsmail Ağaya (Batman, 1994)</h3>
                <p>1994 yılında Batman'da kaybedilen İsmail Ağaya'nın annesi Müfide Ağaya ile görüşme</p>
              </div>
              <a className="btn-action" href="#">
                <i className="fa fa-file-text-o"></i> View report
              </a>
            </div>
            <div className="video">
              <div>
                <iframe src="https://player.vimeo.com/video/68836138"
                width="284" height="165" frameBorder="0" allowFullScreen></iframe>
                <h3>İhsan Arslan (Şırnak-Cizre, 1993)</h3>
                <p>1993 yılında Şırnak-Cizre'de zorla kaybedilen İhsan Arslan'ın eşi Şevkiye Arslan ile yapılan görüşme.</p>
              </div>
              <a className="btn-action" href="#">
                <i className="fa fa-file-text-o"></i> View report
              </a>
            </div>
          </div>

          <a href="#" className="btn btn-default btn-lg">
            <i className="fa fa-search"></i> All 55 videos
          </a>

          <h2>
            <span>Our database in numbers</span>
          </h2>

          <div>
            <ul className="stats">
              <li><b>XXX</b> Victims in the database</li>
              <li><b>XXX</b> Victims on ongoing trials</li>
              <li><b>XXX</b> Suspects on trials</li>
              <li><b>XXX</b> Acquitted suspects</li>
              <li><b>XXX</b> Convicted perpetrators</li>
            </ul>
            <p className="stats-description">Numbers and lists are not exhaustive, they represent the current <a href="#">Verified data</a>.</p>
          </div>

          <h2>
            <span>Explore the events</span>
          </h2>

          <div className="map">
            <div className="img-map"></div>
            <div className="filters">
              <ul className="search__filter">
                <li>City</li>
                <li className="wide">
                  <ul className="multiselect is-active">
                    <li className="multiselectActions">
                      <div className="form-group">
                        <i className="fa fa-search"></i> <input type="text" className="form-control" placeholder="Search item" value="" />
                      </div>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">Adana</span>
                        <span className="multiselectItem-results">1</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">Ankara</span>
                        <span className="multiselectItem-results">8</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">Bingöl</span>
                        <span className="multiselectItem-results">3</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">Adana</span>
                        <span className="multiselectItem-results">1</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">Ankara</span>
                        <span className="multiselectItem-results">8</span>
                      </label>
                    </li>

                    <li className="multiselectActions">
                      <button className="btn btn-xs btn-default">
                        <i className="fa fa-caret-down"></i> <span>3 more</span>
                      </button>
                    </li>

                  </ul>
                </li>
              </ul>

              <ul className="search__filter">
                <li>Year</li>
                <li className="wide">
                  <ul className="multiselect is-active">
                    <li className="multiselectActions">
                      <div className="form-group">
                        <i className="fa fa-search"></i> <input type="text" className="form-control" placeholder="Search item" value="" />
                      </div>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">1994</span>
                        <span className="multiselectItem-results">127</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">1995</span>
                        <span className="multiselectItem-results">64</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">1993</span>
                        <span className="multiselectItem-results">49</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">1994</span>
                        <span className="multiselectItem-results">127</span>
                      </label>
                    </li>

                    <li className="multiselectItem" title="Argentina">
                      <input type="checkbox" className="multiselectItem-input" value="gq5x91tl5vdndn29" id="paisesgq5x91tl5vdndn29" />
                      <label className="multiselectItem-label">
                        <i className="multiselectItem-icon fa fa-square-o"></i><i className="multiselectItem-icon fa fa-check"></i>
                        <span className="multiselectItem-name">1995</span>
                        <span className="multiselectItem-results">64</span>
                      </label>
                    </li>

                    <li className="multiselectActions">
                      <button className="btn btn-xs btn-default">
                        <i className="fa fa-caret-down"></i> <span>3 more</span>
                      </button>
                    </li>

                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(zorlakayHomepage);