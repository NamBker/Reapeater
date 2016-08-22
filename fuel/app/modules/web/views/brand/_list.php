<table class="table table-striped">
    <thead>
    <tr>
        <th style="width: 100px"><?php echo $label['no']; ?></th>
        <th><?php echo $label['company_name']; ?></th>
        <th><?php echo $label['status']; ?></th>
        <th><?php echo $label['brand_name']; ?></th>
        <th><?php echo $label['brand_address']; ?></th>
        <th><?php echo $label['brand_phone_number']; ?></th>
        <th><?php echo $label['count_shop']; ?></th>
    </tr>
    </thead>
    <tbody>
    <?php foreach ($brands as $row => $brand) : ?>
        <tr>
            <td><?php echo $row + 1; ?></td>
            <td><?php echo $brand->company->company_name; ?></td>
            <td><?php echo $status[$brand['brand_status']]; ?></td>
            <td><?php echo $brand['brand_name']; ?></td>
            <td><?php echo $brand['brand_address']; ?></td>
            <td><?php echo $brand['brand_phone_no']; ?></td>
            <?php $store = array(); ?>
            <?php foreach ($brand->section as $section): ?>
                <?php $store[] = count($section->store); ?>
            <?php endforeach; ?>
            <td><?php echo array_sum($store); ?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>