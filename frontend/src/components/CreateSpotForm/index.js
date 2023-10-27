import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CESForm.css";
import { useHistory } from "react-router-dom";
import { addImages, createSpot, editSpot } from "../../store/spots";


const CreateOrEditSpotForm = ({ type, spot }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const [country, setCountry] = useState(type === "edit" && spot ? spot.country : "");
  const [address, setAddress] = useState(type === "edit" && spot ? spot.address : "");
  const [city, setCity] = useState(type === "edit" && spot ? spot.city : "");
  const [state, setState] = useState(type === "edit" && spot ? spot.state : "");
  const [description, setDescription] = useState(type === "edit" && spot ? spot.description : "");
  const [lat, setLat] = useState(type === "edit" && spot ? spot.lat : "");
  const [lng, setLng] = useState(type === "edit" && spot ? spot.lng : "");
  const [name, setName] = useState(type === "edit" && spot ? spot.name : "");
  const [price, setPrice] = useState(type === "edit" && spot ? spot.price : "");
  const [previewImageUrl, setPreviewImageUrl] = useState(type === "edit" && spot ? spot.SpotImages[0].url : "");
  const [url1, setUrl1] = useState(type === "edit" && spot && spot.SpotImages[1] ? spot.SpotImages[1].url : "");
  const [url2, setUrl2] = useState(type === "edit" && spot && spot.SpotImages[2] ? spot.SpotImages[2].url : "");
  const [url3, setUrl3] = useState(type === "edit" && spot && spot.SpotImages[3] ? spot.SpotImages[3].url : "");
  const [url4, setUrl4] = useState(type === "edit" && spot && spot.SpotImages[4] ? spot.SpotImages[4].url : "");
  const [errors, setErrors] = useState({});

  const notEmpty = (url) => {
    if (url === "https://www.ewingoutdoorsupply.com/media/catalog/product/placeholder/default/shutterstock_161251868.png") {
      return ""
    }
    return url
  }

  const checkPrice = (price) => {
    if (price < 0) {
      setPrice(0)
      return 0;
    }
    return price;
  }
  const checkLat = (lat) => {
    if (lat > 90) {
      setLat(90)
      return 90
    };
    if (lat < -90) {
      setLat(-90)
      return -90
    };
    return lat
  }
  const checkLng = (lng) => {
    if (lng > 180) {
      setLng(180)
      return 180;
    }
    if (lng < -180) {
      setLng(-180)
      return -180;
    }
    return lng
  }

  if (!user) {
    history.replace("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const spotImgs = [
      {
        url: previewImageUrl,
        preview: true,
      }
    ];
    [url1, url2, url3, url4].forEach(url => {
      if (url) {
        spotImgs.push({
          url,
          preview: false
        })
      } else {
        spotImgs.push({
          url: "https://www.ewingoutdoorsupply.com/media/catalog/product/placeholder/default/shutterstock_161251868.png",
          preview: false,
        });
      }

    })


    const spotDetails = {
      ownerId: user.id,
      address,
      country,
      city,
      lat: +lat,
      lng: +lng,
      state,
      description,
      name,
      price,
    };

    if (type === "edit" && user.username === "TheManager") {
      spotDetails.ownerId = spot.ownerId
    }

    if (!previewImageUrl.length) {
      errors.previewImageUrl = "Preview image is required";
    }

    if (
      !previewImageUrl.includes("png") &&
      !previewImageUrl.includes("jpg") &&
      !previewImageUrl.includes("jpeg")
    ) {
      errors.urlEndsWith = "Image URL must end in .png, .jpg, or .jpeg";
    }

    if (!country) errors.country = "Country is required"

    if (!address.length) errors.address = "Address is required"

    if (!city.length) errors.city = "City is required"

    if (!state.length) errors.state = "State is required"

    if (lat === ""
    || !(+lat)
    || +lat > 90
    || +lat < -90) errors.lat = "Latitude must be between -90 and 90";

    if (lng === ""
    || !(+lng)
    || +lng > 180
    || +lng < -180) errors.lng = "Longitude must be between -180 and 180";

    if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";

    if (!name.length) errors.name = "Name is required"

    if (price < 0) errors.price = "Price is invalid";

    if (!price) errors.price = "Price is required"

    if (!Object.keys(errors).length) {
      if (type !== 'edit') {
        try {
          const res = await dispatch(createSpot(spotDetails));
          await dispatch(addImages(res.id, spotImgs));
          history.push(`/spots/${res.id}`);
        } catch (e) {
          setErrors(e)
        }
      } else {
        // try {
        await dispatch(editSpot(spotDetails, spot.id, spotImgs));
        history.push(`/spots/${spot.id}`);
        // } catch (e) {
        //   setErrors(e)
        // }
      }

    }

    setErrors(errors)
  };
  return (
    <div className="create-form-div">
      <form className="create-a-spot-form" onSubmit={handleSubmit}>
        {type !== 'edit' ? <h1 id="CES-title">Create a new Spot</h1> : <h1 id="CES-title">Update your spot</h1>}
        <h3>Where's your place located?</h3>
        <p>
          Guest will only get your exact address once they have booked a
          reservation.
        </p>
        <div id="country">
          <p className="form-labels">Country</p>
          {errors.country && (
            <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.country}**
            </p>
          )}
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div id="address">
          <p className="form-labels">
            Street Address</p>
          {errors.address && (
            <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.address}**
            </p>
          )}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div id="city-state">
          <div id="city">
            <p className="form-labels">
              City</p>
            {errors.city && (
              <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
                **{errors.city}**
              </p>
            )}
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div id="state">
            <p className="form-labels">
              State</p>
            {errors.state && (
              <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
                **{errors.state}**
              </p>
            )}
            <input
              type="text"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        <div id="lat-lng">
          <div id="lat">
            <p className="form-labels">
              Latitude</p>
            {errors.lat && (
              <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
                **{errors.lat}**
              </p>
            )}
            <input
              type="decimal"
              min="-90"
              max="90"
              placeholder="Latitude"
              value={checkLat(lat)}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div id="lng">
            <p className="form-labels">
              Longitude</p>
            {errors.lng && (
              <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
                **{errors.lng}**
              </p>
            )}
            <input
              type="number"
              min="-180"
              max="180"
              placeholder="Longitude"
              value={checkLng(lng)}
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>

        <h3>Describe your place to guests</h3>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <br />
        {errors.description && (
          <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
            **{errors.description}**
          </p>
        )}
        <span id="spot-description-span">
          <textarea
          id="spot-description-ces"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </span>


        <h3>
          Create a title for your spot
        </h3>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <br />
        {errors.name && (
          <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
            **Name is required**
          </p>
        )}
        <span id="name">
          <input
            type="text"
            placeholder="Create a title for your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </span>


        <h3>
          Set a base price for your spot
        </h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher
          in search results.
        </p>
        <br />
        {errors.price && (
          <p style={{ fontSize: "13px", color: "red", margin: "5px 0 0 0" }}>
            **{errors.price}**
          </p>
        )}
        <span id="price-span">
          <input
            type="number"
            placeholder="Price per night (USD)"
            min="0"
            value={checkPrice(price)}
            onChange={(e) => setPrice(e.target.value)}
          />
        </span>


        <h3>
          Liven up your spot with photos
        </h3>
        <p>
          Submit a link to at least one photo to publish your spot.
        </p>
        <input
          className="spot-img-urls"
          type="text"
          placeholder="Preview Image URL"
          value={previewImageUrl}
          onChange={(e) => setPreviewImageUrl(e.target.value)}
        />
        {errors.previewImageUrl && (
          <p style={{ fontSize: "13px", color: "red", margin: "0" }}>
            *{errors.previewImageUrl}
            *{errors.urlEndsWith}
          </p>
        )}
        <input
          disabled={!previewImageUrl.length}
          className="spot-img-urls"
          type="text"
          name="previewImageUrl"
          placeholder="Image Url"
          value={notEmpty(url1)}
          onChange={(e) => setUrl1(e.target.value)}
        />
        {(errors.urlEndsWith && url1) && (
          <p style={{ fontSize: "13px", color: "red", margin: "0" }}>
            *{errors.urlEndsWith}
          </p>
        )}
        <input
          disabled={!previewImageUrl.length}
          className="spot-img-urls"
          type="text"
          name="previewImageUrl"
          placeholder="Image Url"
          value={notEmpty(url2)}
          onChange={(e) => setUrl2(e.target.value)}
        />
        {(errors.urlEndsWith && url2) && (
          <p style={{ fontSize: "13px", color: "red", margin: "0" }}>
            *{errors.urlEndsWith}
          </p>
        )}
        <input
          disabled={!previewImageUrl.length}
          className="spot-img-urls"
          type="text"
          name="previewImageUrl"
          placeholder="Image Url"
          value={notEmpty(url3)}
          onChange={(e) => setUrl3(e.target.value)}
        />
        {(errors.urlEndsWith && url3) && (
          <p style={{ fontSize: "13px", color: "red", margin: "0" }}>
            *{errors.urlEndsWith}
          </p>
        )}
        <input
          disabled={!previewImageUrl.length}
          className="spot-img-urls"
          type="text"
          name="previewImageUrl"
          placeholder="Image Url"
          value={notEmpty(url4)}
          onChange={(e) => setUrl4(e.target.value)}
        />
        {(errors.urlEndsWith && url4) && (
          <p style={{ fontSize: "13px", color: "red", margin: "0" }}>
            *{errors.urlEndsWith}
          </p>
        )}
        <button id="spot-submit-button" type="submit">
          {type !== "edit" ? 'Create Spot' : 'Update Spot'}
        </button>
      </form>
    </div>
  );
}

export default CreateOrEditSpotForm;
