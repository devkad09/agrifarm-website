import { useState } from "react";
import { ShoppingBag, MapPin, Phone, PlusCircle, CheckCircle, Tag } from "lucide-react";
import { toast } from "sonner";

interface Listing {
  id: string;
  farmerName: string;
  crop: string;
  quantity: string;
  pricePerUnit: string;
  location: string;
  region: string;
  dateListed: string;
  contact: string;
}

const initialListings: Listing[] = [
  {
    id: "LST-301",
    farmerName: "Kwaku Bonsu",
    crop: "Yellow Maize",
    quantity: "150 Bags (100kg)",
    pricePerUnit: "GH₵ 600 / bag",
    location: "Ejura Farmgate",
    region: "Ashanti Region",
    dateListed: "Today",
    contact: "+233 24 *** 1120",
  },
  {
    id: "LST-302",
    farmerName: "Abena Owusu",
    crop: "Fresh Tomatoes",
    quantity: "80 Crates (50kg)",
    pricePerUnit: "GH₵ 340 / crate",
    location: "Akomadan",
    region: "Ashanti Region",
    dateListed: "Today",
    contact: "+233 20 *** 9988",
  },
  {
    id: "LST-303",
    farmerName: "Yao Dagbati",
    crop: "Pona Yam",
    quantity: "300 Tubers",
    pricePerUnit: "GH₵ 1,400 / 100 tubers",
    location: "Kpandai / Salaga Road",
    region: "Northern Region",
    dateListed: "Yesterday",
    contact: "+233 55 *** 3341",
  },
  {
    id: "LST-304",
    farmerName: "Kofi Appiah",
    crop: "Fresh Cassava",
    quantity: "200 Bags (100kg)",
    pricePerUnit: "GH₵ 195 / bag",
    location: "Techiman Outskirts",
    region: "Bono East",
    dateListed: "2 days ago",
    contact: "+233 24 *** 8820",
  },
];

export function FarmgateTradeBoard() {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [cropFilter, setCropFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  // New Listing Form State
  const [name, setName] = useState("");
  const [crop, setCrop] = useState("Yellow Maize");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("+233 ");

  const filteredListings = listings.filter((l) => {
    if (cropFilter === "All") return true;
    return l.crop.toLowerCase().includes(cropFilter.toLowerCase());
  });

  function handlePostListing(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !quantity || !price || !location) {
      toast.error("Please fill in all required listing fields.");
      return;
    }

    const newListing: Listing = {
      id: `LST-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: name,
      crop,
      quantity,
      pricePerUnit: `GH₵ ${price}`,
      location,
      region: "Direct Farmgate",
      dateListed: "Just now",
      contact,
    };

    setListings([newListing, ...listings]);
    toast.success(`Harvest batch for ${crop} posted to AgriFarm Trade Board!`);
    setShowModal(false);
    setName("");
    setQuantity("");
    setPrice("");
    setLocation("");
  }

  return (
    <div className="card-tactile p-6 md:p-8 rounded-2xl border border-border bg-card space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Direct Farmgate Commodity Board</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-foreground">
            Ghana Farmer Harvest Postings & Trade Bulletin
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect directly with verified smallholders offering harvest batches at farmgate prices without middleman markups.
          </p>
        </div>

        <button
          onClick={() => setShowModal(!showModal)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Available Harvest Batch</span>
        </button>
      </div>

      {/* Form Drawer Modal */}
      {showModal && (
        <form onSubmit={handlePostListing} className="bg-background p-5 rounded-xl border border-primary/30 space-y-4 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-display font-semibold text-base text-foreground border-b border-border pb-2">
            Post Farmgate Crop Batch for Sale
          </h4>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Farmer Name / Co-op</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kwaku Addo / Ejura Co-op"
                className="w-full text-xs rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Crop Type</label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full text-xs rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              >
                <option value="Yellow Maize">Yellow Maize</option>
                <option value="White Maize">White Maize</option>
                <option value="Fresh Tomatoes">Fresh Tomatoes</option>
                <option value="Pona Yam">Pona Yam</option>
                <option value="Fresh Cassava">Fresh Cassava</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Available Quantity</label>
              <input
                type="text"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 150 Bags (100kg)"
                className="w-full text-xs rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Farmgate Price (GH₵)</label>
              <input
                type="text"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 600 / bag"
                className="w-full text-xs font-mono rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Farmgate Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Ejura, Ashanti"
                className="w-full text-xs rounded-lg border border-border bg-card p-2.5 outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Publish Listing
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-3">
        <span className="text-xs text-muted-foreground font-medium mr-1">Filter Batch:</span>
        {["All", "Maize", "Tomatoes", "Yam", "Cassava"].map((c) => (
          <button
            key={c}
            onClick={() => setCropFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              cropFilter === c ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-secondary-foreground hover:bg-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Trade Bulletin Listings Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredListings.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-background space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-base text-foreground">{item.crop}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{item.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">Offered by <strong>{item.farmerName}</strong></span>
              </div>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                {item.pricePerUnit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-card p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">Available Batch</span>
                <strong className="text-foreground font-mono">{item.quantity}</strong>
              </div>
              <div className="bg-card p-2.5 rounded-lg border border-border">
                <span className="text-[10px] text-muted-foreground block">Farmgate Origin</span>
                <span className="text-foreground font-medium flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-primary flex-none" /> {item.location}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-primary" /> {item.contact}
              </span>
              <span>Listed {item.dateListed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
