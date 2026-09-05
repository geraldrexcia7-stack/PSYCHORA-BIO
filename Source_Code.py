import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Polygon, Circle, Ellipse, Wedge

fig, ax = plt.subplots(figsize=(7,8))

# ================= WAJAH BADUT =================
# --- Kepala bulat ---
ax.add_patch(Circle((5,4.2), 2.6, fc='#FFE4C4', ec='black', lw=2, zorder=1))

# --- Rambut badut (dua rumbai samping) ---
ax.add_patch(Circle((2.2,4.0), 1.1, fc='#FF7F11', ec='black', lw=2, zorder=0))
ax.add_patch(Circle((7.8,4.0), 1.1, fc='#FF7F11', ec='black', lw=2, zorder=0))

# --- Mata ---
for cx in [3.9, 6.1]:
    ax.add_patch(Ellipse((cx,4.7), 0.55,0.7, fc='white', ec='black', lw=1.5, zorder=2))
    ax.add_patch(Circle((cx,4.6), 0.22, fc='#2E4A9E', zorder=3))
    ax.add_patch(Circle((cx-0.07,4.7), 0.08, fc='white', zorder=4))

# --- Alis tebal ---
ax.plot([3.3,4.5],[5.5,5.3], color='black', lw=4, solid_capstyle='round', zorder=3)
ax.plot([5.5,6.7],[5.3,5.5], color='black', lw=4, solid_capstyle='round', zorder=3)

# --- Pipi merah ---
ax.add_patch(Circle((3.3,3.4), 0.55, fc='#FF6B6B', ec=None, alpha=0.85, zorder=2))
ax.add_patch(Circle((6.7,3.4), 0.55, fc='#FF6B6B', ec=None, alpha=0.85, zorder=2))

# --- Hidung bulat merah ---
ax.add_patch(Circle((5,3.7), 0.55, fc='#E63946', ec='black', lw=2, zorder=4))
ax.add_patch(Circle((4.82,3.88), 0.13, fc='white', alpha=0.6, zorder=5))

# --- Mulut lebar tersenyum ---
ax.add_patch(Wedge((5,2.7), 1.15, 200, 340, width=0.4, fc='#B22222', ec='black', lw=1.8, zorder=3))
ax.add_patch(Rectangle((4.55,2.35), 0.9,0.28, fc='white', ec='black', lw=1, zorder=4))

# ================= TOPI = ATAP RUMAH (Polygon) =================
ax.add_patch(Polygon([[3.0,6.0],[5,9.0],[7.0,6.0]], closed=True,
                      fc='salmon', ec='black', lw=2, zorder=5))

ax.set_xlim(0,10)
ax.set_ylim(0,10.5)
ax.set_aspect('equal')
ax.set_xticks(range(0,11))
ax.set_yticks(range(0,11))
ax.grid(True, color='gray', linestyle='--', linewidth=0.6, alpha=0.5)
ax.set_title('Wajah Badut dengan Topi Atap Rumah — Objek Primitif', fontsize=13, fontweight='bold')
ax.set_xlabel('sumbu X')
ax.set_ylabel('sumbu Y')

plt.tight_layout()
plt.show()