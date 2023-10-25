import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import "./CreateASpot.css";
import { useHistory } from "react-router-dom";
import { addImages, createSpot, editSpot } from "../../store/spots";


const CreateOrEditSpotForm = ({ type, spot }) => {
  // console.log(type);
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
    if ( url === "https://www.ewingoutdoorsupply.com/media/catalog/product/placeholder/default/shutterstock_161251868.png") {
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

    if (!country.length) errors.country = "Country is required"

    if (!address.length) errors.address = "Address is required"

    if (!city.length) errors.city = "City is required"

    if (!state.length) errors.state = "State is required"

    if (lat === "") errors.lat = "Latitude is required";

    if (lng === "") errors.lng = "Longitude is required"

    if (description.length < 30) errors.description = "Description needs a minimum of 30 characters";

    if (!name.length) errors.name = "Name is required"

    if (price < 0) errors.price = "Price is invalid";

    if (!price) errors.price = "Price is required"

    console.log(errors);
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
        console.log('edit');
        // try {
          const res = await dispatch(editSpot(spotDetails, spot.id, spotImgs));
          console.log('made it here');
          history.push(`/spots/${spot.id}`);
        // } catch (e) {
        //   setErrors(e)
        // }
      }

    }

    setErrors(errors)
  };
  // useEffect
  return (
    <div className="create-form-div">
      <form className="create-a-spot-form" onSubmit={handleSubmit}>
        {type !== 'edit' ? <h1>Create a new Spot</h1> : <h1>Update your spot</h1>}
        <h3>Where's your place located?</h3>
        <p>
          Guest will only get your exact address once they have booked a
          reservation.
        </p>
        <label className="form-labels">
          Country
          {errors.country && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.country}**
            </p>
          )}
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label className="form-labels">
          Street Address
          {errors.address && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.address}**
            </p>
          )}
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label className="form-labels">
          City
          {errors.city && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.city}**
            </p>
          )}
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label className="form-labels">
          State
          {errors.state && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.state}**
            </p>
          )}
          <input
            type="text"
            placeholder="STATE"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label className="form-labels">
          Latitude
          {errors.lat && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
              **{errors.lat}**
            </p>
          )}
          <input
            type="number"
            min="-90"
            max="90"
            placeholder="Latitude"
            value={checkLat(lat)}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
        <label className="form-labels">
          Longitude
          {errors.lng && (
            <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
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
        </label>
        <h3>Describe your place to guests</h3>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        <textarea
          id="spot-description"
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && (
          <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
            **{errors.description}**
          </p>
        )}
        <h3>
          Create a title for your spot
        </h3>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          placeholder="Create a title for your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
            **Name is required**
          </p>
        )}
        <h3>
          Set a base price for your spot
        </h3>
        <p>
          Competitive pricing can help your listing stand out and rank higher
          in search results.
        </p>
        <input
          type="number"
          placeholder="Price per night (USD)"
          min="0"
          value={checkPrice(price)}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && (
          <p style={{ fontSize: "12px", color: "red", margin: "5px 0 0 0" }}>
            **{errors.price}**
          </p>
        )}
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
          <p style={{ fontSize: "12px", color: "red", margin: "0" }}>
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
          <p style={{ fontSize: "12px", color: "red", margin: "0" }}>
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
          <p style={{ fontSize: "12px", color: "red", margin: "0" }}>
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
          <p style={{ fontSize: "12px", color: "red", margin: "0" }}>
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
          <p style={{ fontSize: "12px", color: "red", margin: "0" }}>
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
